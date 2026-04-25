import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchAllOrders, updateOrderStatus } from './adminSlice';

const STATUS_TRANSITIONS = {
  PENDING:    ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['SHIPPED', 'CANCELLED'],
  SHIPPED:    ['DELIVERED', 'RETURNED'],
  DELIVERED:  ['RETURNED'],
  CANCELLED:  [],
  RETURNED:   [],
};

const STATUS_COLOR = {
  PENDING:    '#ffc107',
  PROCESSING: '#17a2b8',
  SHIPPED:    '#007bff',
  DELIVERED:  '#28a745',
  CANCELLED:  '#dc3545',
  RETURNED:   '#6c757d',
};

const ALL_STATUSES = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'];

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { orders, ordersLoading, ordersTotalPages, error } = useSelector((state) => state.admin);
  const [page, setPage] = useState(0);
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [updating, setUpdating] = useState({});

  useEffect(() => {
    dispatch(fetchAllOrders({ page, size: 20, status: statusFilter }));
  }, [dispatch, page, statusFilter]);

  const formatPrice = (price) => `Rs. ${parseFloat(price || 0).toLocaleString('en-IN')}`;

  const handleStatusChange = async (orderNumber, currentStatus, newStatus) => {
    if (newStatus === currentStatus) return;

    const allowed = STATUS_TRANSITIONS[currentStatus] || [];
    if (!allowed.includes(newStatus)) {
      toast.error(`Cannot change status from ${currentStatus} to ${newStatus}`);
      return;
    }

    setUpdating(prev => ({ ...prev, [orderNumber]: true }));
    try {
      await dispatch(updateOrderStatus({ orderNumber, status: newStatus })).unwrap();
      toast.success(`Order #${orderNumber} moved to ${newStatus}`);
    } catch (err) {
      toast.error(typeof err === 'string' ? err : err?.message || 'Failed to update status');
    } finally {
      setUpdating(prev => ({ ...prev, [orderNumber]: false }));
    }
  };

  if (ordersLoading) {
    return (
      <div className="admin-body">
        <div className="loading">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-body">
        <div className="page-heading">Orders</div>
        <div className="table-box" style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#dc3545', marginBottom: '15px', display: 'block' }}></i>
          <h3 style={{ marginBottom: '10px', color: '#dc3545' }}>Unable to load orders</h3>
          <p style={{ color: '#888', marginBottom: '16px' }}>{error}</p>
          <button className="btn-primary" onClick={() => dispatch(fetchAllOrders({ page, size: 20, status: statusFilter }))}>
            <i className="fas fa-sync-alt"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  const displayedOrders = orders.filter(o => !paymentFilter || o.paymentMethod === paymentFilter);

  return (
    <div className="admin-body">
      <div className="page-heading">Orders</div>

      {/* Stat Cards */}
      <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-list"></i></div>
          <div className="stat-info"><div className="stat-label">Showing</div><div className="stat-value">{orders.length}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255,193,7,0.15)', color: '#ffc107' }}><i className="fas fa-clock"></i></div>
          <div className="stat-info"><div className="stat-label">Pending</div><div className="stat-value" style={{ color: '#ffc107' }}>{orders.filter(o => o.status === 'PENDING').length}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0,123,255,0.15)', color: '#007bff' }}><i className="fas fa-cog"></i></div>
          <div className="stat-info"><div className="stat-label">Processing</div><div className="stat-value" style={{ color: '#007bff' }}>{orders.filter(o => o.status === 'PROCESSING').length}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(40,167,69,0.15)', color: '#28a745' }}><i className="fas fa-check-circle"></i></div>
          <div className="stat-info"><div className="stat-label">Delivered</div><div className="stat-value" style={{ color: '#28a745' }}>{orders.filter(o => o.status === 'DELIVERED').length}</div></div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ color: '#888', fontSize: '13px' }}>{displayedOrders.length} order{displayedOrders.length === 1 ? '' : 's'}</div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <select
            className="filter-select"
            style={{ width: 'auto', minWidth: '160px' }}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          >
            <option value="">All Status</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select
            className="filter-select"
            style={{ width: 'auto', minWidth: '160px' }}
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
          >
            <option value="">All Payments</option>
            <option value="CARD">Card</option>
            <option value="UPI">UPI</option>
            <option value="NETBANKING">Net Banking</option>
            <option value="COD">COD</option>
            <option value="RAZORPAY">Razorpay</option>
          </select>
        </div>
      </div>

      {displayedOrders.length === 0 ? (
        <div className="table-box" style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-box-open" style={{ fontSize: '48px', color: '#888', marginBottom: '15px', display: 'block' }}></i>
          <p style={{ color: '#888' }}>No orders found</p>
        </div>
      ) : (
        <>
          <div style={{ display: 'grid', gap: '15px' }}>
            {displayedOrders.map((order) => {
              const nextStatuses = STATUS_TRANSITIONS[order.status] || [];
              const isUpdating = updating[order.orderNumber];
              return (
                <div key={order.orderNumber} className="table-box" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px', gap: '12px', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '5px' }}>
                        Order #{order.orderNumber}
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        Customer: {order.customerName || 'Customer'} ({order.customerEmail || 'No email'})
                      </div>
                      <div style={{ fontSize: '12px', color: '#888' }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </div>
                    </div>
                    <div style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600',
                      background: `${STATUS_COLOR[order.status] || '#888'}20`,
                      color: STATUS_COLOR[order.status] || '#888',
                      border: `1px solid ${STATUS_COLOR[order.status] || '#888'}`,
                    }}>
                      {order.status}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: '15px', alignItems: 'center', paddingTop: '15px', borderTop: '1px solid #333' }}>
                    <div>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Total Amount</div>
                      <div style={{ fontSize: '16px', fontWeight: '700', color: '#ff8c00' }}>
                        {formatPrice(order.total)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Payment</div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{order.paymentMethod}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Items</div>
                      <div style={{ fontSize: '14px', fontWeight: '500' }}>{order.items?.length || 0} item(s)</div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                      {nextStatuses.length > 0 ? (
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {nextStatuses.map(s => (
                            <button
                              key={s}
                              className="btn-primary"
                              style={{
                                padding: '6px 12px',
                                fontSize: '12px',
                                background: `${STATUS_COLOR[s]}20`,
                                color: STATUS_COLOR[s],
                                border: `1px solid ${STATUS_COLOR[s]}`,
                                opacity: isUpdating ? 0.6 : 1,
                              }}
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(order.orderNumber, order.status, s)}
                            >
                              {isUpdating ? <i className="fas fa-spinner fa-spin"></i> : `→ ${s}`}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#555', fontStyle: 'italic' }}>Final state</span>
                      )}
                      <Link
                        to={`/admin/orders/${order.orderNumber}`}
                        className="btn-outline"
                        style={{ padding: '6px 14px', whiteSpace: 'nowrap', fontSize: '12px' }}
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {ordersTotalPages > 1 && (
            <div className="admin-pagination">
              <button className="pagination-btn" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>
                Previous
              </button>
              <span className="pagination-info">Page {page + 1} of {ordersTotalPages}</span>
              <button className="pagination-btn" onClick={() => setPage(p => Math.min(ordersTotalPages - 1, p + 1))} disabled={page >= ordersTotalPages - 1}>
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrders;
