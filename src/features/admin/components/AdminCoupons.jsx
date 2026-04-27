import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { fetchAdminCoupons, createCoupon, updateCoupon, deleteCoupon } from '../slices/adminSlice';
import { fetchAllCategories } from '../../products/slices/categorySlice';

const emptyForm = {
  code: '',
  description: '',
  discountType: 'AMOUNT',
  discountValue: '',
  minOrderValue: '',
  maxDiscount: '',
  expiresAt: '',
  active: true,
  categoryId: '',
};

const formatDateTimeLocal = (value) => {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  const tzOffset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - tzOffset).toISOString().slice(0, 16);
};

const AdminCoupons = () => {
  const dispatch = useDispatch();
  const { coupons, couponsLoading, error } = useSelector((state) => state.admin);
  const { categories } = useSelector((state) => state.categories);
  const [showForm, setShowForm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, code: '' });

  useEffect(() => {
    dispatch(fetchAdminCoupons());
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const resetForm = () => {
    setShowForm(false);
    setEditingCoupon(null);
    setFormData(emptyForm);
    setFormErrors({});
  };

  const buildPayload = () => {
    const payload = {
      code: formData.code.trim(),
      description: formData.description.trim() || null,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      active: Boolean(formData.active),
    };

    if (formData.minOrderValue) payload.minOrderValue = Number(formData.minOrderValue);
    if (formData.maxDiscount) payload.maxDiscount = Number(formData.maxDiscount);
    if (formData.expiresAt) payload.expiresAt = new Date(formData.expiresAt).toISOString();
    if (formData.categoryId) payload.categoryId = Number(formData.categoryId);
    else payload.categoryId = null;

    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errs = {};
    if (!formData.code.trim()) errs.code = 'Coupon code is required';
    if (!formData.discountValue || Number(formData.discountValue) <= 0) errs.discountValue = 'Discount value must be greater than 0';
    if (formData.discountType === 'PERCENT' && Number(formData.discountValue) > 100) {
      errs.discountValue = 'Percentage discount cannot exceed 100';
    }
    if (formData.minOrderValue && Number(formData.minOrderValue) < 0) {
      errs.minOrderValue = 'Minimum order value must be 0 or more';
    }
    if (formData.maxDiscount && Number(formData.maxDiscount) < 0) {
      errs.maxDiscount = 'Maximum discount must be 0 or more';
    }
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }

    setFormErrors({});
    setSubmitting(true);
    try {
      const payload = buildPayload();
      if (editingCoupon) {
        await dispatch(updateCoupon({ couponId: editingCoupon.id, couponData: payload })).unwrap();
        toast.success('Coupon updated successfully');
      } else {
        await dispatch(createCoupon(payload)).unwrap();
        toast.success('Coupon created successfully');
      }
      resetForm();
      dispatch(fetchAdminCoupons());
    } catch (submitError) {
      toast.error(typeof submitError === 'string' ? submitError : submitError?.message || 'Failed to save coupon');
    } finally {
      setSubmitting(false);
    }
  };

  const startEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowForm(false);
    setFormData({
      code: coupon.code || '',
      description: coupon.description || '',
      discountType: coupon.discountType || 'AMOUNT',
      discountValue: coupon.discountValue?.toString() || '',
      minOrderValue: coupon.minOrderValue?.toString() || '',
      maxDiscount: coupon.maxDiscount?.toString() || '',
      expiresAt: formatDateTimeLocal(coupon.expiresAt),
      active: coupon.active ?? true,
      categoryId: coupon.categoryId?.toString() || '',
    });
  };

  const handleDelete = (coupon) => {
    setDeleteConfirm({ open: true, id: coupon.id, code: coupon.code });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteCoupon(deleteConfirm.id)).unwrap();
      toast.success('Coupon deleted successfully');
      dispatch(fetchAdminCoupons());
    } catch (deleteError) {
      toast.error(typeof deleteError === 'string' ? deleteError : deleteError?.message || 'Failed to delete coupon');
    } finally {
      setDeleteConfirm({ open: false, id: null, code: '' });
    }
  };

  return (
    <div className="admin-body">
      <div className="page-heading">Coupons</div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button className="btn-primary" onClick={() => { resetForm(); setShowForm(true); }}>
          <i className="fas fa-plus"></i> Add Coupon
        </button>
      </div>

      {(showForm || editingCoupon) && (
        <div className="table-box" style={{ marginBottom: '24px' }}>
          <div className="table-header">
            <span style={{ fontWeight: 600, color: '#ff8c00' }}>
              {editingCoupon ? `Edit: ${editingCoupon.code}` : 'New Coupon'}
            </span>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '20px' }} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '15px', marginBottom: '20px' }}>
              <div className="form-group">
                <label>Coupon Code <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                <input
                  type="text"
                  className={`form-input${formErrors.code ? ' error' : ''}`}
                  value={formData.code}
                  onChange={(e) => { setFormData({ ...formData, code: e.target.value.toUpperCase() }); if (formErrors.code) setFormErrors((prev) => ({ ...prev, code: '' })); }}
                  placeholder="e.g. CLICKMART10"
                />
                {formErrors.code && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.code}</span>}
              </div>
              <div className="form-group">
                <label>Discount Type</label>
                <select
                  className="form-input"
                  value={formData.discountType}
                  onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                >
                  <option value="AMOUNT">Fixed Amount</option>
                  <option value="PERCENT">Percentage</option>
                </select>
              </div>
              <div className="form-group">
                <label>Discount Value <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={`form-input${formErrors.discountValue ? ' error' : ''}`}
                  value={formData.discountValue}
                  onChange={(e) => { setFormData({ ...formData, discountValue: e.target.value }); if (formErrors.discountValue) setFormErrors((prev) => ({ ...prev, discountValue: '' })); }}
                  placeholder={formData.discountType === 'PERCENT' ? '0 - 100' : 'e.g. 500'}
                />
                {formErrors.discountValue && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.discountValue}</span>}
              </div>
              <div className="form-group">
                <label>Minimum Order Value</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={formData.minOrderValue}
                  onChange={(e) => setFormData({ ...formData, minOrderValue: e.target.value })}
                  placeholder="e.g. 1000"
                />
              </div>
              <div className="form-group">
                <label>Max Discount</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="form-input"
                  value={formData.maxDiscount}
                  onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                  placeholder="Optional maximum discount"
                />
              </div>
              <div className="form-group">
                <label>Expires At</label>
                <input
                  type="datetime-local"
                  className="form-input"
                  value={formData.expiresAt}
                  onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Restrict to Category <span style={{ color: '#888', fontSize: '11px', fontWeight: 400 }}>(optional)</span></label>
                <select
                  className="form-input"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingTop: '6px' }}>
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  style={{ width: '16px', height: '16px' }}
                />
                <label style={{ margin: 0, cursor: 'pointer' }}>Active</label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting
                  ? <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                  : <><i className="fas fa-save"></i> {editingCoupon ? 'Update' : 'Create'}</>
                }
              </button>
              <button
                type="button"
                onClick={resetForm}
                style={{ background: '#333', border: '1px solid #444', color: '#aaa', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '13px' }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="table-box">
        <div className="table-header">
          <span style={{ color: '#aaa', fontSize: '13px' }}>{coupons.length} {coupons.length === 1 ? 'coupon' : 'coupons'}</span>
        </div>

        {couponsLoading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '28px', display: 'block', marginBottom: '10px' }}></i>
            Loading coupons...
          </div>
        ) : coupons.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
            <i className="fas fa-ticket-alt" style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}></i>
            No coupons available. Click "Add Coupon" to create one.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Value</th>
                  <th>Min Order</th>
                  <th>Max Discount</th>
                  <th>Expires</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((coupon) => (
                  <tr key={coupon.id}>
                    <td style={{ color: '#ff8c00', fontWeight: 600 }}>{coupon.code}</td>
                    <td>{coupon.discountType}</td>
                    <td>{coupon.discountType === 'PERCENT' ? `${coupon.discountValue}%` : `?${coupon.discountValue}`}</td>
                    <td>{coupon.minOrderValue ? `?${coupon.minOrderValue}` : '-'}</td>
                    <td>{coupon.maxDiscount ? `?${coupon.maxDiscount}` : '-'}</td>
                    <td style={{ color: '#aaa', fontSize: '13px' }}>{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleString() : '-'}</td>
                    <td>{coupon.active ? 'Active' : 'Inactive'}</td>
                    <td style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <button className="btn-icon" title="Edit" style={{ color: '#007bff' }} onClick={() => startEdit(coupon)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-icon" title="Delete" style={{ color: '#dc3545' }} onClick={() => handleDelete(coupon)}>
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteConfirm.open}
        title="Delete Coupon"
        message={`Delete coupon "${deleteConfirm.code}"? This cannot be undone.`}
        confirmText="Delete"
        danger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null, code: '' })}
      />

      {error && (
        <div style={{ color: '#dc3545', marginTop: '16px' }}>{error}</div>
      )}
    </div>
  );
};

export default AdminCoupons;

