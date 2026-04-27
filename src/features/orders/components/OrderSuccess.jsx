import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderByNumber } from '../slices/orderSlice';

const trackingSteps = [
  { key: 'PENDING',    icon: 'fa-check',    label: 'Order Confirmed', desc: 'Your order has been placed successfully' },
  { key: 'PROCESSING', icon: 'fa-box',      label: 'Processing',      desc: 'We are preparing your order' },
  { key: 'SHIPPED',    icon: 'fa-truck',    label: 'Shipped',         desc: 'Your order is on its way' },
  { key: 'DELIVERED',  icon: 'fa-home',     label: 'Delivered',       desc: 'Package delivered to your address' },
];

const statusOrder = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED'];

const OrderSuccess = () => {
  const { orderNumber } = useParams();
  const dispatch = useDispatch();
  const { currentOrder: order } = useSelector((state) => state.orders);

  useEffect(() => {
    if (orderNumber) {
      dispatch(fetchOrderByNumber({ orderNumber }));
    }
  }, [dispatch, orderNumber]);

  const formatPrice = (price) => `₹${parseFloat(price).toLocaleString('en-IN')}`;

  const currentStatusIndex = order ? statusOrder.indexOf(order.status) : 0;

  return (
    <div className="container">
      <div style={{ textAlign: 'center', padding: '50px 20px', maxWidth: '600px', margin: '0 auto' }}>
        {/* Success icon */}
        <div style={{
          width: '90px', height: '90px',
          background: 'rgba(40,167,69,0.15)', border: '3px solid #28a745',
          borderRadius: '50%', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '36px', color: '#28a745',
          margin: '0 auto 20px',
        }}>
          <i className="fas fa-check"></i>
        </div>

        <h2 style={{ color: '#ff8c00', fontSize: '30px', fontWeight: '700', marginBottom: '8px' }}>Order Placed!</h2>
        <p style={{ color: '#aaa', fontSize: '15px', marginBottom: '5px' }}>Thank you for shopping with ClickMart!</p>
        <p style={{ color: '#888', fontSize: '13px', marginBottom: '30px' }}>A confirmation will be sent to your email address.</p>

        {/* Order details */}
        {order && (
          <div className="box" style={{ textAlign: 'left', marginBottom: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
              <div>
                <div style={{ color: '#888', fontSize: '12px', marginBottom: '3px' }}>Order ID</div>
                <div style={{ color: '#ff8c00', fontWeight: '700' }}>#{order.orderNumber}</div>
              </div>
              <div>
                <div style={{ color: '#888', fontSize: '12px', marginBottom: '3px' }}>Order Date</div>
                <div style={{ fontWeight: '600' }}>
                  {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : '—'}
                </div>
              </div>
              <div>
                <div style={{ color: '#888', fontSize: '12px', marginBottom: '3px' }}>Total Amount</div>
                <div style={{ fontWeight: '600' }}>{formatPrice(order.total)}</div>
              </div>
              <div>
                <div style={{ color: '#888', fontSize: '12px', marginBottom: '3px' }}>Payment</div>
                <div style={{ color: '#28a745', fontWeight: '600' }}>
                  <i className="fas fa-check-circle"></i> {order.paymentMethod}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Order tracking timeline */}
        <div className="box" style={{ textAlign: 'left', marginBottom: '25px' }}>
          <div style={{ color: '#ff8c00', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', fontSize: '14px' }}>
            Order Tracking
          </div>
          {trackingSteps.map((step, idx) => {
            const isDone = currentStatusIndex >= idx;
            const isLast = idx === trackingSteps.length - 1;
            return (
              <div key={step.key}>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start' }}>
                  <div style={{
                    width: '30px', height: '30px', borderRadius: '50%', flexShrink: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px',
                    background: isDone ? '#ff8c00' : '#333',
                    color: isDone ? '#111' : '#666',
                    border: isDone ? 'none' : '1px solid #444',
                  }}>
                    <i className={`fas ${step.icon}`}></i>
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', color: isDone ? '#fff' : '#888' }}>{step.label}</div>
                    <div style={{ color: isDone ? '#aaa' : '#666', fontSize: '13px' }}>{step.desc}</div>
                  </div>
                </div>
                {!isLast && (
                  <div style={{ width: '2px', height: '35px', margin: '3px 0 3px 14px', background: isDone && currentStatusIndex > idx ? '#ff8c00' : '#333' }}></div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-orange" style={{ padding: '11px 24px' }}>
            <i className="fas fa-shopping-bag"></i> Continue Shopping
          </Link>
          <Link to="/orders" className="btn-outline" style={{ padding: '11px 24px' }}>
            <i className="fas fa-th"></i> My Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
