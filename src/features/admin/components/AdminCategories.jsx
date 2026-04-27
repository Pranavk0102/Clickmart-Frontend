import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllCategories } from '../../products/slices/categorySlice';
import { createCategory, updateCategory, deleteCategory, toggleCategory } from '../slices/adminSlice';
import ConfirmModal from '../../../components/common/ConfirmModal';
import { toast } from 'react-toastify';

const ITEMS_PER_PAGE = 10;

const AdminCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: '' });
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(categories.length / ITEMS_PER_PAGE);
  const paginatedCategories = categories.slice(currentPage * ITEMS_PER_PAGE, (currentPage + 1) * ITEMS_PER_PAGE);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '' });
    setFormErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Category name is required';
    else if (formData.name.trim().length > 100) errs.name = 'Max 100 characters';
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});
    setSubmitting(true);
    try {
      if (editingCategory) {
        await dispatch(updateCategory({ categoryId: editingCategory.id, categoryData: formData })).unwrap();
        toast.success('Category updated successfully');
      } else {
        await dispatch(createCategory(formData)).unwrap();
        toast.success('Category created successfully');
      }
      resetForm();
      dispatch(fetchAllCategories());
    } catch (error) {
      toast.error(typeof error === 'string' ? error : error?.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (cat) => {
    try {
      await dispatch(toggleCategory(cat.id)).unwrap();
      toast.success(`Category "${cat.name}" ${cat.active !== false ? 'deactivated' : 'activated'}`);
      dispatch(fetchAllCategories());
    } catch (error) {
      toast.error(typeof error === 'string' ? error : error?.message || 'Failed to toggle category');
    }
  };

  const handleDelete = async (categoryId, categoryName) => {
    setDeleteConfirm({ open: true, id: categoryId, name: categoryName });
  };

  const confirmDelete = async () => {
    try {
      await dispatch(deleteCategory(deleteConfirm.id)).unwrap();
      toast.success('Category deleted');
      dispatch(fetchAllCategories());
    } catch (error) {
      toast.error(typeof error === 'string' ? error : error?.message || 'Failed to delete category');
    } finally {
      setDeleteConfirm({ open: false, id: null, name: '' });
    }
  };

  const startEdit = (category) => {
    setEditingCategory(category);
    setShowCreateForm(false);
    setFormData({ name: category.name, description: category.description || '' });
  };

  return (
    <div className="admin-body">
      <div className="page-heading">Categories</div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
        <button
          className="btn-primary"
          onClick={() => { resetForm(); setShowCreateForm(true); }}
        >
          <i className="fas fa-plus"></i> Add Category
        </button>
      </div>

      {/* Create / Edit Form */}
      {(showCreateForm || editingCategory) && (
        <div className="table-box" style={{ marginBottom: '24px' }}>
          <div className="table-header">
            <span style={{ fontWeight: 600, color: '#ff8c00' }}>
              {editingCategory ? `Edit: ${editingCategory.name}` : 'New Category'}
            </span>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '20px' }} noValidate>
            <div className="form-group">
              <label>Category Name <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <input
                type="text"
                className={`form-input${formErrors.name ? ' error' : ''}`}
                value={formData.name}
                onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors(p => ({ ...p, name: '' })); }}
                placeholder="e.g. Electronics"
              />
              {formErrors.name && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>}
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                className="form-input"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Short description (optional)"
                style={{ resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting
                  ? <><i className="fas fa-spinner fa-spin"></i> Saving…</>
                  : <><i className="fas fa-save"></i> {editingCategory ? 'Update' : 'Create'}</>
                }
              </button>
              <button type="button" onClick={resetForm}
                style={{ background: '#333', border: '1px solid #444', color: '#aaa', padding: '10px 20px', borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '13px' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Table */}
      <div className="table-box">
        <div className="table-header">
          <span style={{ color: '#aaa', fontSize: '13px' }}>
            {categories.length} {categories.length === 1 ? 'category' : 'categories'}
          </span>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '28px', display: 'block', marginBottom: '10px' }}></i>
            Loading categories…
          </div>
        ) : categories.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
            <i className="fas fa-tags" style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}></i>
            No categories yet. Click "Add Category" to create one.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCategories.map((cat) => (
                    <tr key={cat.id} style={{ opacity: cat.active === false ? 0.6 : 1 }}>
                      <td style={{ color: '#ff8c00', fontWeight: 600, fontSize: '12px' }}>#{cat.id}</td>
                      <td>
                        <div className="td-bold">{cat.name}</div>
                      </td>
                      <td style={{ color: '#888', fontSize: '13px' }}>
                        {cat.description || <span style={{ color: '#555', fontStyle: 'italic' }}>No description</span>}
                      </td>
                      <td>
                        <span style={{
                          display: 'inline-block',
                          padding: '2px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          background: cat.active !== false ? 'rgba(40, 167, 69, 0.15)' : 'rgba(220, 53, 69, 0.15)',
                          color: cat.active !== false ? '#28a745' : '#dc3545',
                        }}>
                          {cat.active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <button
                            className="btn-icon"
                            title="Edit"
                            style={{ color: '#007bff' }}
                            onClick={() => startEdit(cat)}
                          >
                            <i className="fas fa-edit"></i>
                          </button>
                          <button
                            className="btn-icon"
                            title={cat.active !== false ? 'Deactivate' : 'Activate'}
                            style={{ color: cat.active !== false ? '#ffc107' : '#28a745' }}
                            onClick={() => handleToggle(cat)}
                          >
                            <i className={`fas fa-${cat.active !== false ? 'ban' : 'check-circle'}`}></i>
                          </button>
                          {cat.active !== false && (
                            <button
                              className="btn-icon"
                              title="Delete (only allowed if no active products)"
                              style={{ color: '#dc3545' }}
                              onClick={() => handleDelete(cat.id, cat.name)}
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="admin-pagination">
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`pagination-btn ${currentPage === i ? 'active' : ''}`}
                onClick={() => setCurrentPage(i)}
                style={currentPage === i ? { background: '#ff8c00', color: '#111', borderColor: '#ff8c00' } : {}}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="pagination-btn"
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage >= totalPages - 1}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={deleteConfirm.open}
        title="Delete Category"
        message={`Delete category "${deleteConfirm.name}"? This will only succeed if the category has no active products. This action cannot be undone.`}
        confirmText="Delete"
        danger={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ open: false, id: null, name: '' })}
      />
    </div>
  );
};

export default AdminCategories;
