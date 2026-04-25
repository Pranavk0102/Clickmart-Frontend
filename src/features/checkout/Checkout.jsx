import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../../config/api';
import { fetchCart } from '../cart/cartSlice';
import { fetchAddresses } from '../profile/addressSlice';
import { placeOrder } from '../orders/orderSlice';
import { validateCoupon, clearValidatedCoupon } from './couponSlice';
import { toast } from 'react-toastify';
import CheckoutStepIndicator from './CheckoutStepIndicator';

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: cartItems } = useSelector((state) => state.cart);
  const { addresses } = useSelector((state) => state.addresses);
  const { validatedCoupon } = useSelector((state) => state.coupons);
  const { loading: orderLoading } = useSelector((state) => state.orders);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [couponCode, setCouponCode] = useState('');

  const [deliveryOptions, setDeliveryOptions] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);

  useEffect(() => {
    dispatch(fetchCart());
    dispatch(fetchAddresses());

    const fetchDeliveryOptions = async () => {
      try {
        const response = await api.get('/delivery/options');
        const options = response.data?.data || [];
        setDeliveryOptions(options);
        if (options.length > 0) {
          setSelectedDelivery(options[0]);
        }
      } catch (error) {
        console.error('Failed to fetch delivery options:', error);
      }
    };
    fetchDeliveryOptions();
  }, [dispatch]);

  useEffect(() => {
    if (addresses.length > 0 && !selectedAddress) {
      const defaultAddr = addresses.find(a => a.isDefault) || addresses[0];
      setSelectedAddress(defaultAddr.id);
    }
  }, [addresses, selectedAddress]);

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = (subtotal > 0 && selectedDelivery) ? selectedDelivery.price : 0;
  const discount = validatedCoupon?.discountAmount || 0;
  const total = subtotal + deliveryCharge - discount;

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    try {
      await dispatch(validateCoupon({ code: couponCode, orderTotal: subtotal })).unwrap();
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error(error?.message || error || 'Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(clearValidatedCoupon());
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const loadRazorpayScript = () => new Promise((resolve, reject) => {
    if (window.Razorpay) {
      return resolve(true);
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay script'));
    document.body.appendChild(script);
  });

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    if (!selectedDelivery) {
      toast.error('Please select a delivery option');
      return;
    }

    const baseOrderData = {
      addressId: selectedAddress,
      deliveryType: selectedDelivery.name,
      paymentMethod,
      couponCode: validatedCoupon?.code || null,
    };



    if (paymentMethod === 'RAZORPAY') {
      try {
        await loadRazorpayScript();
        const response = await api.post('/payments/razorpay/order', {
          deliveryType: selectedDelivery.name,
          couponCode: validatedCoupon?.code || null,
        });

        const razorpayOrder = response.data?.data;
        if (!razorpayOrder || !razorpayOrder.orderId) {
          throw new Error('Unable to create Razorpay order');
        }

        const options = {
          key: razorpayOrder.keyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: 'ClickMart',
          description: 'Complete your payment',
          order_id: razorpayOrder.orderId,
          handler: async (paymentResult) => {
            try {
              const order = await dispatch(placeOrder({
                ...baseOrderData,
                razorpayOrderId: paymentResult.razorpay_order_id,
                razorpayPaymentId: paymentResult.razorpay_payment_id,
                razorpaySignature: paymentResult.razorpay_signature,
              })).unwrap();
              toast.success('Order placed successfully!');
              navigate(`/order-success/${order.orderNumber}`);
            } catch (error) {
              toast.error(error?.message || error || 'Failed to place order after payment');
            }
          },
          theme: {
            color: '#ff8c00',
          },
          modal: {
            ondismiss: () => {
              toast.info('Payment cancelled.');
            },
          },
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (response) => {
          toast.error(response?.error?.description || 'Payment failed. Please try again.');
        });
        rzp.open();
      } catch (error) {
        toast.error(error?.message || error || 'Unable to process Razorpay payment');
      }

      return;
    }

    try {
      const order = await dispatch(placeOrder(baseOrderData)).unwrap();
      toast.success('Order placed successfully!');
      navigate(`/order-success/${order.orderNumber}`);
    } catch (error) {
      toast.error(error?.message || error || 'Failed to place order');
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <i className="fas fa-shopping-cart" style={{ fontSize: '64px', color: '#ff8c00', marginBottom: '20px', display: 'block' }}></i>
          <h2 style={{ marginBottom: '10px' }}>Your Cart is Empty</h2>
          <p style={{ color: '#888', marginBottom: '20px' }}>Add some products to checkout</p>
          <Link to="/products" className="btn-orange">Browse Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/cart">Cart</Link>
        <span>/</span>
        <span>Checkout</span>
      </div>

      <div className="section-title">Checkout</div>

      <CheckoutStepIndicator currentStep={2} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'start' }}>
        <div>
          {/* Delivery Address */}
          <div className="box">
            <div className="box-title">Delivery Address</div>
            {addresses.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                <p>No saved addresses</p>
                <Link to="/profile#addresses" className="btn-orange" style={{ marginTop: '10px', display: 'inline-block' }}>
                  Add Address
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '10px' }}>
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddress(address.id)}
                    style={{
                      padding: '12px',
                      background: '#333',
                      borderRadius: '6px',
                      border: selectedAddress === address.id ? '2px solid #ff8c00' : '1px solid #444',
                      cursor: 'pointer',
                      transition: 'border-color 0.2s'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                      <input
                        type="radio"
                        checked={selectedAddress === address.id}
                        onChange={() => setSelectedAddress(address.id)}
                        style={{ marginTop: '3px', accentColor: '#ff8c00' }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                          {address.name}
                          {address.isDefault && (
                            <span style={{ marginLeft: '8px', fontSize: '10px', background: '#ff8c00', color: '#111', padding: '2px 6px', borderRadius: '8px' }}>
                              Default
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: '12px', color: '#aaa', lineHeight: '1.6' }}>
                          {address.addr1}, {address.addr2 && `${address.addr2}, `}
                          {address.city}, {address.state} - {address.pin}
                          <br />
                          Phone: {address.phone}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Options */}
          <div className="box">
            <div className="box-title">Delivery Option</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              {deliveryOptions.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setSelectedDelivery(option)}
                  className="payment-option"
                  style={{ borderColor: selectedDelivery?.id === option.id ? '#ff8c00' : '#333', justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input
                      type="radio"
                      checked={selectedDelivery?.id === option.id}
                      onChange={() => setSelectedDelivery(option)}
                      style={{ accentColor: '#ff8c00' }}
                    />
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: '600' }}>{option.label}</span>
                      <span style={{ fontSize: '12px', color: '#aaa' }}>{option.description}</span>
                    </div>
                  </div>
                  <span style={{ fontWeight: 'bold', color: '#ff8c00' }}>
                    {option.price === 0 ? 'FREE' : formatPrice(option.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method */}
          <div className="box">
            <div className="box-title">Payment Method</div>
            <div style={{ display: 'grid', gap: '10px' }}>
              <div
                onClick={() => setPaymentMethod('COD')}
                className="payment-option"
                style={{ borderColor: paymentMethod === 'COD' ? '#ff8c00' : '#333' }}
              >
                <input
                  type="radio"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                  style={{ accentColor: '#ff8c00' }}
                />
                <i className="fas fa-money-bill-wave"></i>
                <span>Cash on Delivery</span>
              </div>

              <div
                onClick={() => setPaymentMethod('RAZORPAY')}
                className="payment-option"
                style={{ borderColor: paymentMethod === 'RAZORPAY' ? '#ff8c00' : '#333' }}
              >
                <input
                  type="radio"
                  checked={paymentMethod === 'RAZORPAY'}
                  onChange={() => setPaymentMethod('RAZORPAY')}
                  style={{ accentColor: '#ff8c00' }}
                />
                <i className="fas fa-credit-card"></i>
                <span>Online Payment</span>
              </div>
            </div>


          </div>
        </div>

        <div>
          {/* Coupon */}
          <div className="box">
            <div className="box-title">Apply Coupon</div>
            {validatedCoupon ? (
              <div style={{ padding: '12px', background: '#28a74520', border: '1px solid #28a745', borderRadius: '6px', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: '600', color: '#28a745' }}>
                      {validatedCoupon.code}
                    </div>
                    <div style={{ fontSize: '12px', color: '#aaa' }}>
                      Saved {formatPrice(validatedCoupon.discountAmount)}
                    </div>
                  </div>
                  <button onClick={handleRemoveCoupon} className="btn-remove" style={{ padding: '4px 8px' }}>
                    <i className="fas fa-times"></i>
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  style={{ flex: 1 }}
                />
                <button onClick={handleValidateCoupon} className="btn-orange">
                  Apply
                </button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="box">
            <div className="box-title">Order Summary</div>
            <div className="summary-row">
              <span>Subtotal ({cartItems.length} items)</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{formatPrice(deliveryCharge)}</span>
            </div>
            {discount > 0 && (
              <div className="summary-row" style={{ color: '#28a745' }}>
                <span>Discount</span>
                <span>-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="summary-total">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="btn-orange"
              style={{ width: '100%', padding: '14px', marginTop: '15px', fontSize: '15px' }}
              disabled={orderLoading || !selectedAddress || cartItems.length === 0}
            >
              {orderLoading ? 'Placing Order...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
