import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCustomers, toggleCustomerStatus } from '../slices/adminSlice';
import { toast } from 'react-toastify';
import api from '../../../config/api';

const AdminCustomers = () => {
  const dispatch = useDispatch();
  const { customers, customersLoading, customersTotalPages, error } = useSelector((state) => state.admin);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [appliedSearch, setAppliedSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [addErrors, setAddErrors] = useState({});
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchAllCustomers({ page, size: 20, query: appliedSearch || undefined }));
  }, [dispatch, page, appliedSearch]);

  const handleSearch = () => {
    setPage(0);
    setAppliedSearch(search.trim());
  };

  const handleToggleStatus = async (customerId) => {
    try {
      await dispatch(toggleCustomerStatus(customerId)).unwrap();
      toast.success('Customer status updated');
    } catch (err) {
      toast.error(typeof err === 'string' ? err : err?.message || 'Failed to update status');
    }
  };

  const validateAddForm = () => {
    const errs = {};
    if (!addForm.firstName.trim()) errs.firstName = 'First name is required';
    if (!addForm.lastName.trim()) errs.lastName = 'Last name is required';
    if (!addForm.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addForm.email)) errs.email = 'Enter a valid email';
    if (!addForm.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(addForm.phone)) errs.phone = 'Phone must be 10 digits';
    if (!addForm.password) errs.password = 'Password is required';
    else if (addForm.password.length < 6) errs.password = 'Min 6 characters';
    if (!addForm.confirmPassword) errs.confirmPassword = 'Please confirm password';
    else if (addForm.password !== addForm.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const errs = validateAddForm();
    if (Object.keys(errs).length) { setAddErrors(errs); return; }
    setAddErrors({});
    setAddLoading(true);
    try {
      await api.post('/auth/register', addForm);
      toast.success('Customer created successfully');
      setShowAddModal(false);
      setAddForm({ firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: '' });
      dispatch(fetchAllCustomers({ page, size: 20, query: appliedSearch || undefined }));
    } catch (err) {
      toast.error(err.response?.data?.message || err.response?.data?.error || 'Failed to create customer');
    } finally {
      setAddLoading(false);
    }
  };

  const setAddField = (field, value) => {
    setAddForm(prev => ({ ...prev, [field]: value }));
    if (addErrors[field]) setAddErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="admin-body">
      <div className="page-heading">Customers</div>

      <div className="table-box">
        <div className="table-header" style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            className="search-input"
            placeholder="Search by name or email�"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            style={{ flex: 1 }}
          />
          <button className="btn-primary" onClick={handleSearch} style={{ padding: '8px 16px' }}>
            <i className="fas fa-search"></i>
          </button>
          <button className="btn-primary" onClick={() => setShowAddModal(true)} style={{ padding: '8px 16px', whiteSpace: 'nowrap' }}>
            <i className="fas fa-plus"></i> Add Customer
          </button>
        </div>

        {customersLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '28px', display: 'block', marginBottom: '10px' }}></i>
            Loading customers�
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#dc3545' }}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}></i>
            <p>{error}</p>
            <button className="btn-primary" style={{ marginTop: '12px' }}
              onClick={() => dispatch(fetchAllCustomers({ page, size: 20 }))}>
              <i className="fas fa-sync-alt"></i> Retry
            </button>
          </div>
        ) : customers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
            <i className="fas fa-users" style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}></i>
            No customers found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {customers.map((customer) => (
                  <tr key={customer.id}>
                    <td style={{ color: '#ff8c00', fontWeight: 600, fontSize: '12px' }}>#{customer.id}</td>
                    <td>
                      <div className="td-bold">{customer.name || `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '�'}</div>
                    </td>
                    <td style={{ color: '#aaa', fontSize: '13px' }}>{customer.email}</td>
                    <td style={{ color: '#aaa', fontSize: '13px' }}>{customer.phone || '�'}</td>
                    <td>
                      <span className={`status-badge ${customer.role === 'ADMIN' ? 'status-processing' : 'status-delivered'}`}>
                        {customer.role || 'CUSTOMER'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${customer.active ? 'status-delivered' : 'status-cancelled'}`}>
                        {customer.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn-icon"
                        title={customer.active ? 'Deactivate' : 'Activate'}
                        style={{ color: customer.active ? '#dc3545' : '#28a745' }}
                        onClick={() => handleToggleStatus(customer.id)}
                      >
                        <i className={`fas ${customer.active ? 'fa-user-slash' : 'fa-user-check'}`}></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {customersTotalPages > 1 && (
          <div className="admin-pagination">
            <button className="pagination-btn" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}>Previous</button>
            <span className="pagination-info">Page {page + 1} of {customersTotalPages}</span>
            <button className="pagination-btn" onClick={() => setPage((p) => Math.min(customersTotalPages - 1, p + 1))} disabled={page >= customersTotalPages - 1}>Next</button>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-overlay open" onClick={() => setShowAddModal(false)}>
          <div className="modal-box" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title"><i className="fas fa-user-plus"></i> Add New Customer</div>
            <button className="modal-close" onClick={() => setShowAddModal(false)}><i className="fas fa-times"></i></button>
            <form onSubmit={handleAddCustomer} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div className="form-group">
                  <label>First Name <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                  <input type="text" className={`form-input${addErrors.firstName ? ' error' : ''}`} value={addForm.firstName}
                    onChange={(e) => setAddField('firstName', e.target.value)} />
                  {addErrors.firstName && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{addErrors.firstName}</span>}
                </div>
                <div className="form-group">
                  <label>Last Name <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                  <input type="text" className={`form-input${addErrors.lastName ? ' error' : ''}`} value={addForm.lastName}
                    onChange={(e) => setAddField('lastName', e.target.value)} />
                  {addErrors.lastName && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{addErrors.lastName}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Email <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                <input type="email" className={`form-input${addErrors.email ? ' error' : ''}`} value={addForm.email}
                  onChange={(e) => setAddField('email', e.target.value)} />
                {addErrors.email && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{addErrors.email}</span>}
              </div>
              <div className="form-group">
                <label>Phone (10 digits) <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                <input type="text" className={`form-input${addErrors.phone ? ' error' : ''}`} maxLength="10" value={addForm.phone}
                  onChange={(e) => setAddField('phone', e.target.value.replace(/\D/g, ''))} />
                {addErrors.phone && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{addErrors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Password <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                <input type="password" className={`form-input${addErrors.password ? ' error' : ''}`} value={addForm.password}
                  onChange={(e) => setAddField('password', e.target.value)} />
                {addErrors.password && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{addErrors.password}</span>}
              </div>
              <div className="form-group">
                <label>Confirm Password <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                <input type="password" className={`form-input${addErrors.confirmPassword ? ' error' : ''}`} value={addForm.confirmPassword}
                  onChange={(e) => setAddField('confirmPassword', e.target.value)} />
                {addErrors.confirmPassword && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{addErrors.confirmPassword}</span>}
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
                <button type="submit" className="btn-primary" disabled={addLoading}>
                  {addLoading ? <><i className="fas fa-spinner fa-spin"></i> Creating�</> : <><i className="fas fa-save"></i> Create</>}
                </button>
                <button type="button" onClick={() => { setShowAddModal(false); setAddErrors({}); }}
                  style={{ background: '#333', border: '1px solid #444', color: '#aaa', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '13px' }}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCustomers;

