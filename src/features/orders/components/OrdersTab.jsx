import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchMyOrders, cancelOrder, returnOrder } from '../slices/orderSlice';
import OrderProgressTracker from './OrderProgressTracker';
import ReviewModal from '../../products/components/ReviewModal';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { toast } from 'react-toastify';
import { generateInvoicePDF } from '../../../utils/invoiceGenerator';
import './OrdersTab.css';

const OrdersTab = () => {
  const dispatch = useDispatch();
  const { orders, loading } = useSelector((state) => state.orders);
  const [filter, setFilter] = useState('ALL');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [cancelConfirmId, setCancelConfirmId] = useState(null);
  const [returnConfirmId, setReturnConfirmId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  const handleLeaveReview = (order, item) => {
    setSelectedProduct({
      productId: item.productId,
      orderId: order.orderNumber,
      productName: item.productName,
    });
    setReviewModalOpen(true);
  };

  const handleCancelOrder = async () => {
    setActionLoading(true);
    try {
      await dispatch(cancelOrder(cancelConfirmId)).unwrap();
      toast.success('Order cancelled successfully');
      dispatch(fetchMyOrders());
    } catch (error) {
      toast.error(error?.message || error || 'Failed to cancel order');
    } finally {
      setActionLoading(false);
      setCancelConfirmId(null);
    }
  };

  const handleReturnOrder = async () => {
    setActionLoading(true);
    try {
      await dispatch(returnOrder(returnConfirmId)).unwrap();
      toast.success('Return request submitted successfully');
      dispatch(fetchMyOrders());
    } catch (error) {
      toast.error(error?.message || error || 'Failed to submit return request');
    } finally {
      setActionLoading(false);
      setReturnConfirmId(null);
    }
  };

  const filteredOrders =
    filter === 'ALL' ? orders : orders.filter((order) => order.status === filter);

  const formatPrice = (price) => `₹${parseFloat(price).toLocaleString('en-IN')}`;

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders-tab">
      <div className="section-head">
        <i className="fas fa-shopping-bag"></i>
        My Orders
      </div>

      <div className="order-filters">
        {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
          <button
            key={status}
            className={`filter-btn ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status}
          </button>
        ))}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-box-open"></i>
          <p>No orders found</p>
          <Link to="/products" className="btn-shop">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => (
            <div key={order.orderNumber} className="order-card">
              <div className="order-header">
                <div>
                  <div className="order-id">Order #{order.orderNumber}</div>
                  <div className="order-date">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}
                  </div>
                </div>
                <div className={`order-status status-${String(order.status || '').toLowerCase()}`}>
                  {order.status}
                </div>
              </div>

              <OrderProgressTracker status={order.status} />

              <div className="order-items-row">
                {order.items?.slice(0, 4).map((item, idx) => (
                  <img
                    key={idx}
                    src={item.productImage || '/placeholder.png'}
                    alt={item.productName}
                    title={item.productName}
                    className="order-item-img"
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/48x48?text=No+Image'; }}
                  />
                ))}
                {order.items?.length > 4 && (
                  <div className="more-items">+{order.items.length - 4}</div>
                )}
              </div>

              <div className="order-meta">
                <div className="order-total">
                  Total: {formatPrice(order.total)}
                </div>
                <div className="order-actions">
                  <Link to={`/orders/${order.orderNumber}`} className="btn-view">
                    View Details
                  </Link>
                  {(String(order.status).toUpperCase() === 'PENDING' || String(order.status).toUpperCase() === 'PLACED' || String(order.status).toUpperCase() === 'CONFIRMED') && (
                    <button onClick={() => setCancelConfirmId(order.orderNumber)} className="btn-remove" disabled={actionLoading}>
                      Cancel
                    </button>
                  )}
                  {String(order.status).toUpperCase() === 'DELIVERED' && (
                    <button onClick={() => setReturnConfirmId(order.orderNumber)} className="btn-remove" disabled={actionLoading}
                      style={{ background: 'rgba(108,117,125,0.15)', borderColor: '#6c757d', color: '#6c757d' }}>
                      Return
                    </button>
                  )}
                  {(String(order.status).toUpperCase() === 'DELIVERED' || String(order.status).toUpperCase() === 'SHIPPED') && (
                    <button onClick={() => generateInvoicePDF(order)} className="btn-outline" style={{ padding: '6px 14px', fontSize: '13px' }}>
                      <i className="fas fa-file-pdf"></i> Invoice
                    </button>
                  )}
                  {String(order.status).toUpperCase() === 'DELIVERED' && order.items && (
                    <button
                      className="btn-review"
                      onClick={() => handleLeaveReview(order, order.items[0])}
                    >
                      <i className="fas fa-star"></i> Leave Review
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProduct && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => {
            setReviewModalOpen(false);
            setSelectedProduct(null);
          }}
          productId={selectedProduct.productId}
          orderId={selectedProduct.orderId}
          productName={selectedProduct.productName}
        />
      )}

      <ConfirmModal
        isOpen={!!cancelConfirmId}
        title="Cancel Order"
        message={`Are you sure you want to cancel order #${cancelConfirmId}? This cannot be undone.`}
        confirmText="Cancel Order"
        danger={true}
        onConfirm={handleCancelOrder}
        onCancel={() => setCancelConfirmId(null)}
      />

      <ConfirmModal
        isOpen={!!returnConfirmId}
        title="Return Order"
        message={`Are you sure you want to return order #${returnConfirmId}? A return request will be submitted.`}
        confirmText="Submit Return"
        danger={false}
        onConfirm={handleReturnOrder}
        onCancel={() => setReturnConfirmId(null)}
      />
    </div>
  );
};

export default OrdersTab;
