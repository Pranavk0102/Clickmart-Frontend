import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderByNumber } from '../orders/orderSlice';
import { updateOrderStatus } from './adminSlice';
import { toast } from 'react-toastify';

const statuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'];

const getStatusColor = (status) => {
  const colors = {
    PENDING: '#ffc107', PROCESSING: '#17a2b8', SHIPPED: '#007bff',
    DELIVERED: '#28a745', CANCELLED: '#dc3545', RETURNED: '#6c757d',
  };
  return colors[status] || '#888';
};

const AdminOrderDetail = () => {
  const { orderNumber } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order, loading } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderByNumber({ orderNumber, isAdmin: true }));
  }, [dispatch, orderNumber]);

  const formatPrice = (price) => `₹${parseFloat(price || 0).toLocaleString('en-IN')}`;

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(updateOrderStatus({ orderNumber, status: newStatus })).unwrap();
      toast.success('Order status updated');
      dispatch(fetchOrderByNumber(orderNumber));
    } catch (err) {
      toast.error(err?.message || err || 'Failed to update status');
    }
  };

  if (loading) {
    return <div className="admin-body"><div className="loading">Loading order...</div></div>;
  }

  if (!order) {
    return (
      <div className="admin-body">
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <p style={{ color: '#888' }}>Order not found</p>
          <Link to="/admin/orders" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-body">
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
        <Link to="/admin/orders" className="btn-outline" style={{ padding: '8px 14px' }}>
          <i className="fas fa-arrow-left"></i> Back
        </Link>
        <div className="page-heading" style={{ marginBottom: 0 }}>Order #{order.orderNumber}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }}>
        <div>
          {/* Customer Info */}
          <div className="table-box" style={{ padding: '20px', marginBottom: '16px' }}>
            <div style={{ fontWeight: 600, color: '#ff8c00', marginBottom: '12px' }}>Customer</div>
            <div style={{ fontSize: '14px', color: '#ddd' }}>{order.customerName}</div>
            <div style={{ fontSize: '13px', color: '#888' }}>{order.customerEmail}</div>
          </div>

          {/* Order Items */}
          <div className="table-box" style={{ padding: '20px', marginBottom: '16px' }}>
            <div style={{ fontWeight: 600, color: '#ff8c00', marginBottom: '12px' }}>Items</div>
            {order.items?.map((item) => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #333' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 500 }}>{item.productName}</div>
                  <div style={{ fontSize: '12px', color: '#888' }}>Qty: {item.quantity} × {formatPrice(item.price || item.unitPrice)}</div>
                </div>
                <div style={{ color: '#ff8c00', fontWeight: 700 }}>{formatPrice((item.price || item.unitPrice) * item.quantity)}</div>
              </div>
            ))}
          </div>

          {/* Shipping Address */}
          <div className="table-box" style={{ padding: '20px' }}>
            <div style={{ fontWeight: 600, color: '#ff8c00', marginBottom: '12px' }}>Shipping Address</div>
            <div style={{ fontSize: '14px', color: '#ddd', lineHeight: '1.8' }}>
              <div style={{ fontWeight: 600 }}>{order.shippingName}</div>
              {order.shippingAddr1}, {order.shippingAddr2 && `${order.shippingAddr2}, `}
              <br />{order.shippingCity}, {order.shippingState} - {order.shippingPin}
              <br />Phone: {order.shippingPhone}
            </div>
          </div>
        </div>

        <div>
          {/* Status */}
          <div className="table-box" style={{ padding: '20px', marginBottom: '16px' }}>
            <div style={{ fontWeight: 600, color: '#ff8c00', marginBottom: '12px' }}>Order Status</div>
            <div style={{
              padding: '10px', borderRadius: '8px', textAlign: 'center', fontSize: '15px', fontWeight: 700,
              background: getStatusColor(order.status) + '20', color: getStatusColor(order.status),
              border: `2px solid ${getStatusColor(order.status)}`, marginBottom: '12px'
            }}>
              {order.status}
            </div>
            <select
              className="form-input"
              value={order.status}
              onChange={(e) => handleStatusChange(e.target.value)}
            >
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <div style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}
            </div>
          </div>

          {/* Summary */}
          <div className="table-box" style={{ padding: '20px' }}>
            <div style={{ fontWeight: 600, color: '#ff8c00', marginBottom: '12px' }}>Order Summary</div>
            <div className="summary-row"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>
            <div className="summary-row"><span>Delivery</span><span>{formatPrice(order.deliveryCharge)}</span></div>
            {order.discount > 0 && (
              <div className="summary-row" style={{ color: '#28a745' }}>
                <span>Discount</span><span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="summary-total"><span>Total</span><span>{formatPrice(order.total)}</span></div>
            <div style={{ marginTop: '12px', padding: '10px', background: '#333', borderRadius: '6px', fontSize: '13px' }}>
              <div style={{ color: '#888', marginBottom: '4px' }}>Payment</div>
              <div style={{ fontWeight: 600 }}>{order.paymentMethod}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
