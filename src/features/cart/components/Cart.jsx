import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../slices/cartSlice';
import { validateCoupon, clearValidatedCoupon, fetchCoupons } from '../../checkout/slices/couponSlice';
import { toast } from 'react-toastify';

const Cart = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: cartItems, loading } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { validatedCoupon, loading: couponLoading, coupons } = useSelector((state) => state.coupons);
  const [couponCode, setCouponCode] = useState('');
  const [showCouponModal, setShowCouponModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchCoupons());
    }
  }, [dispatch, isAuthenticated]);

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const handleQuantityChange = async (item, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await dispatch(updateCartItem({ itemId: item.id, productId: item.productId, quantity: newQuantity })).unwrap();
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to update quantity');
    }
  };

  const handleRemove = async (cartItemId) => {
    try {
      await dispatch(removeFromCart(cartItemId)).unwrap();
      toast.success('Item removed from cart');
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const handleClearCart = async () => {
    try {
      await dispatch(clearCart()).unwrap();
      dispatch(clearValidatedCoupon());
      toast.success('Cart cleared');
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error('Please enter a coupon code');
      return;
    }
    try {
      await dispatch(validateCoupon({ code: couponCode, orderTotal: subtotal })).unwrap();
      toast.success('Coupon applied successfully!');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Invalid coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(clearValidatedCoupon());
    setCouponCode('');
    toast.info('Coupon removed');
  };

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const delivery = subtotal > 0 ? 50 : 0;
  const discount = validatedCoupon?.discountAmount || 0;
  const total = subtotal + delivery - discount;

  if (!isAuthenticated) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <i className="fas fa-shopping-cart" style={{ fontSize: '64px', color: '#ff8c00', marginBottom: '20px', display: 'block' }}></i>
          <h2 style={{ marginBottom: '10px' }}>Your Cart</h2>
          <p style={{ color: '#888', marginBottom: '20px' }}>Please login to view your cart</p>
          <Link to="/login" className="btn-orange">Login / Signup</Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading cart...</div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <i className="fas fa-shopping-cart" style={{ fontSize: '64px', color: '#ff8c00', marginBottom: '20px', display: 'block' }}></i>
          <h2 style={{ marginBottom: '10px' }}>Your Cart is Empty</h2>
          <p style={{ color: '#888', marginBottom: '20px' }}>Add some products to get started</p>
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
        <span>Cart</span>
      </div>

      <div className="section-title">Shopping Cart ({cartItems.length} items)</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'start' }}>
        <div className="box">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div className="box-title" style={{ marginBottom: 0, paddingBottom: 0, border: 'none' }}>Cart Items</div>
            <button onClick={handleClearCart} className="btn-remove">
              <i className="fas fa-trash"></i> Clear Cart
            </button>
          </div>

          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img
                src={item.productImage || '/placeholder.png'}
                alt={item.productName}
                onError={(e) => { e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'; }}
              />
              <div className="cart-item-details">
                <div className="cart-item-name">{item.productName}</div>
                <div className="cart-item-price">{formatPrice(item.price)}</div>
                {item.originalPrice > item.price && (
                  <div style={{ color: '#888', fontSize: '12px', textDecoration: 'line-through' }}>
                    {formatPrice(item.originalPrice)}
                  </div>
                )}
              </div>
              <div className="qty-control">
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(item, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span className="qty-num">{item.quantity}</span>
                <button
                  className="qty-btn"
                  onClick={() => handleQuantityChange(item, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              <div style={{ textAlign: 'right', minWidth: '80px' }}>
                <div style={{ fontWeight: '700', color: '#ff8c00' }}>{formatPrice(item.price * item.quantity)}</div>
              </div>
              <button onClick={() => handleRemove(item.id)} className="btn-remove">
                <i className="fas fa-times"></i>
              </button>
            </div>
          ))}
        </div>

        <div className="box">
          <div className="box-title">Order Summary</div>
          
          {/* Coupon Section */}
          <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #333' }}>
            {!validatedCoupon ? (
              <>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    style={{ flex: 1, padding: '10px' }}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading}
                    className="btn-orange"
                    style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}
                  >
                    {couponLoading ? 'Applying...' : 'Apply'}
                  </button>
                </div>
                {coupons.length > 0 && (
                  <button
                    onClick={() => setShowCouponModal(true)}
                    style={{ background: 'none', border: 'none', color: '#ff8c00', fontSize: '12px', cursor: 'pointer', marginTop: '8px', padding: 0, fontFamily: 'Poppins,sans-serif' }}
                  >
                    <i className="fas fa-tag"></i> View available coupons
                  </button>
                )}
              </>
            ) : (
              <div style={{ background: 'rgba(40, 167, 69, 0.1)', border: '1px solid #28a745', borderRadius: '6px', padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ color: '#28a745', fontWeight: '600', fontSize: '13px' }}>
                    <i className="fas fa-check-circle"></i> {validatedCoupon.code} Applied
                  </div>
                  <div style={{ color: '#aaa', fontSize: '11px', marginTop: '2px' }}>
                    You saved {formatPrice(validatedCoupon.discountAmount)}!
                  </div>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  style={{ background: 'transparent', border: 'none', color: '#dc3545', cursor: 'pointer', fontSize: '14px' }}
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            )}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="summary-row">
            <span>Delivery</span>
            <span>{formatPrice(delivery)}</span>
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
            onClick={() => navigate('/checkout')}
            className="btn-orange"
            style={{ width: '100%', padding: '12px', marginTop: '15px' }}
          >
            Proceed to Checkout
          </button>
          <Link to="/products" style={{ display: 'block', textAlign: 'center', marginTop: '10px', color: '#ff8c00', fontSize: '13px' }}>
            <i className="fas fa-arrow-left"></i> Continue Shopping
          </Link>
        </div>
      </div>

      {/* Available Coupons Modal */}
      {showCouponModal && (
        <div className="modal-overlay open" onClick={() => setShowCouponModal(false)}>
          <div style={{ background: '#2a2a2a', border: '2px solid #ff8c00', borderRadius: '10px', padding: '25px', width: '90%', maxWidth: '400px', maxHeight: '80vh', overflowY: 'auto' }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ color: '#ff8c00', fontSize: '16px', fontWeight: '700' }}>
                <i className="fas fa-tag"></i> Available Coupons
              </div>
              <button onClick={() => setShowCouponModal(false)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '18px', cursor: 'pointer' }}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            {coupons.map((coupon) => (
              <div key={coupon.id}
                style={{ background: '#333', border: '1px dashed #444', borderRadius: '8px', padding: '12px', marginBottom: '10px', cursor: 'pointer' }}
                onClick={() => { setCouponCode(coupon.code); setShowCouponModal(false); }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = '#ff8c00'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#444'}
              >
                <div style={{ color: '#ff8c00', fontSize: '14px', fontWeight: '700', marginBottom: '4px' }}>{coupon.code}</div>
                <div style={{ color: '#aaa', fontSize: '12px' }}>{coupon.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
