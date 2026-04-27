import { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderByNumber, cancelOrder, returnOrder } from '../slices/orderSlice';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { toast } from 'react-toastify';
import { generateInvoicePDF } from '../../../utils/invoiceGenerator';

const OrderDetail = () => {
  const { orderNumber } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const { currentOrder: order, loading } = useSelector((state) => state.orders);
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [returnConfirm, setReturnConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchOrderByNumber({ orderNumber }));
  }, [dispatch, orderNumber]);

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#ffc107',
      CONFIRMED: '#17a2b8',
      SHIPPED: '#007bff',
      DELIVERED: '#28a745',
      CANCELLED: '#dc3545',
      RETURNED: '#6c757d'
    };
    return colors[status] || '#888';
  };

  const handleCancelOrder = async () => {
    setCancelConfirm(false);
    setActionLoading(true);
    try {
      await dispatch(cancelOrder(orderNumber)).unwrap();
      toast.success('Order cancelled successfully');
      dispatch(fetchOrderByNumber({ orderNumber }));
    } catch (error) {
      toast.error(error?.message || error || 'Failed to cancel order');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnOrder = async () => {
    setReturnConfirm(false);
    setActionLoading(true);
    try {
      await dispatch(returnOrder(orderNumber)).unwrap();
      toast.success('Return request submitted successfully');
      dispatch(fetchOrderByNumber({ orderNumber }));
    } catch (error) {
      toast.error(error?.message || error || 'Failed to submit return request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownloadInvoice = () => {
    if (order) {
      generateInvoicePDF(order);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#888' }}>Order not found</p>
          <Link to="/orders" className="btn-orange" style={{ marginTop: '20px', display: 'inline-block' }}>
            View All Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/orders">Orders</Link>
        <span>/</span>
        <span>#{order.orderNumber}</span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
        <div className="section-title" style={{ marginBottom: 0 }}>
          Order #{order.orderNumber}
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {(String(order.status).toUpperCase() === 'PENDING' || String(order.status).toUpperCase() === 'PLACED' || String(order.status).toUpperCase() === 'CONFIRMED') && (
            <button onClick={() => setCancelConfirm(true)} className="btn-remove" disabled={actionLoading}>
              <i className="fas fa-times"></i> Cancel Order
            </button>
          )}
          {String(order.status).toUpperCase() === 'DELIVERED' && (
            <button onClick={() => setReturnConfirm(true)} className="btn-remove" disabled={actionLoading}
              style={{ background: 'rgba(108,117,125,0.15)', borderColor: '#6c757d', color: '#6c757d' }}>
              <i className="fas fa-undo"></i> Return Order
            </button>
          )}
          {(String(order.status).toUpperCase() === 'DELIVERED' || String(order.status).toUpperCase() === 'SHIPPED') && (
            <button onClick={handleDownloadInvoice} className="btn-outline"
              style={{ padding: '8px 16px', fontSize: '13px' }}>
              <i className="fas fa-file-pdf"></i> Download Invoice
            </button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '20px', alignItems: 'start' }}>
        <div>
          {/* Order Items */}
          <div className="box">
            <div className="box-title">Order Items</div>
            {order.items?.map((item) => (
              <div key={item.id} className="cart-item">
                <img src={item.productImage} alt={item.productName} />
                <div className="cart-item-details">
                  <div className="cart-item-name">{item.productName}</div>
                  <div className="cart-item-price">{formatPrice(item.unitPrice)}</div>
                  <div style={{ fontSize: '13px', color: '#888' }}>Quantity: {item.quantity}</div>
                </div>
                <div style={{ fontSize: '16px', fontWeight: '700', color: '#ff8c00' }}>
                  {formatPrice(item.unitPrice * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="box">
            <div className="box-title">Shipping Address</div>
            <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#aaa' }}>
              <div style={{ fontWeight: '600', color: '#fff', marginBottom: '5px' }}>
                {order.shippingName}
              </div>
              {order.shippingAddr1}, {order.shippingAddr2 && `${order.shippingAddr2}, `}
              <br />
              {order.shippingCity}, {order.shippingState} - {order.shippingPin}
              <br />
              Phone: {order.shippingPhone}
            </div>
          </div>
        </div>

        <div>
          {/* Order Status */}
          <div className="box">
            <div className="box-title">Order Status</div>
            <div
              style={{
                padding: '12px',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '16px',
                fontWeight: '700',
                background: getStatusColor(order.status) + '20',
                color: getStatusColor(order.status),
                border: `2px solid ${getStatusColor(order.status)}`
              }}
            >
              {order.status}
            </div>
            <div style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginTop: '10px' }}>
              Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN')}
            </div>
          </div>

          {/* Order Summary */}
          <div className="box">
            <div className="box-title">Order Summary</div>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery</span>
              <span>{formatPrice(order.deliveryCharge)}</span>
            </div>
            {order.discount > 0 && (
              <div className="summary-row" style={{ color: '#28a745' }}>
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="summary-total">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
            <div style={{ marginTop: '15px', padding: '12px', background: '#333', borderRadius: '6px', fontSize: '13px' }}>
              <div style={{ color: '#888', marginBottom: '4px' }}>Payment Method</div>
              <div style={{ fontWeight: '600' }}>{order.paymentMethod}</div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal
        isOpen={cancelConfirm}
        title="Cancel Order"
        message={`Are you sure you want to cancel order #${order.orderNumber}? This cannot be undone.`}
        confirmText="Cancel Order"
        danger={true}
        onConfirm={handleCancelOrder}
        onCancel={() => setCancelConfirm(false)}
      />

      <ConfirmModal
        isOpen={returnConfirm}
        title="Return Order"
        message={`Are you sure you want to return order #${order.orderNumber}? A return request will be submitted.`}
        confirmText="Submit Return"
        danger={false}
        onConfirm={handleReturnOrder}
        onCancel={() => setReturnConfirm(false)}
      />
    </div>
  );
};

export default OrderDetail;
