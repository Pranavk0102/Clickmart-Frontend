import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { fetchCategories } from '../../products/slices/categorySlice';
import { fetchProducts } from '../../products/slices/productSlice';
import { createProduct, updateProduct, deleteProduct } from '../slices/adminSlice';
import ConfirmModal from '../../../components/common/ConfirmModal';

const FALLBACK_IMAGE =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <rect width="120" height="120" rx="12" fill="#2a2a2a" />
      <path d="M24 80l20-24 14 18 10-12 28 34H24z" fill="#555" />
      <circle cx="42" cy="40" r="8" fill="#777" />
    </svg>
  `);

const emptyForm = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  brand: '',
  categoryId: '',
  stock: '',
};

const AdminProducts = () => {
  const dispatch = useDispatch();
  const { items: products, loading, totalPages, error } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  const [page, setPage] = useState(0);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null, name: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    dispatch(fetchProducts({ page, size: 20 }));
    dispatch(fetchCategories());
  }, [dispatch, page]);

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        id: category.id,
        name: category.name,
      })),
    [categories]
  );

  const resetForm = () => {
    setShowCreateForm(false);
    setEditingProduct(null);
    setFormData(emptyForm);
    setImageFile(null);
    setFormErrors({});
  };

  const buildPayload = () => {
    const payload = new FormData();
    payload.append('name', formData.name.trim());
    payload.append('description', formData.description.trim());
    payload.append('price', Number(formData.price).toString());

    if (formData.originalPrice) {
      payload.append('originalPrice', Number(formData.originalPrice).toString());
    }
    if (formData.brand.trim()) {
      payload.append('brand', formData.brand.trim());
    }
    payload.append('categoryId', Number(formData.categoryId).toString());
    payload.append('stock', Number(formData.stock).toString());
    if (imageFile) {
      payload.append('imageFile', imageFile);
    }
    return payload;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Product name is required';
    if (!formData.categoryId) errs.categoryId = 'Please select a category';
    if (!formData.price || Number(formData.price) <= 0) errs.price = 'Enter a valid price';
    if (formData.stock === '' || Number(formData.stock) < 0) errs.stock = 'Enter a valid stock quantity';
    if (!formData.description.trim()) errs.description = 'Description is required';
    if (Object.keys(errs).length) { setFormErrors(errs); return; }
    setFormErrors({});

    setSubmitting(true);

    try {
      const payload = buildPayload();

      if (editingProduct) {
        await dispatch(updateProduct({ productId: editingProduct.id, productData: payload })).unwrap();
        toast.success('Product updated successfully');
      } else {
        await dispatch(createProduct(payload)).unwrap();
        toast.success('Product created successfully');
      }

      resetForm();
      dispatch(fetchProducts({ page, size: 20 }));
    } catch (requestError) {
      toast.error(typeof requestError === 'string' ? requestError : requestError?.message || 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const product = products.find(p => p.id === productId);
    setDeleteConfirm({ open: true, id: productId, name: product?.name || 'this product' });
  };

  const confirmDeleteProduct = async () => {
    try {
      await dispatch(deleteProduct(deleteConfirm.id)).unwrap();
      toast.success('Product deleted successfully');
      dispatch(fetchProducts({ page, size: 20 }));
    } catch (requestError) {
      toast.error(typeof requestError === 'string' ? requestError : requestError?.message || 'Failed to delete product');
    } finally {
      setDeleteConfirm({ open: false, id: null, name: '' });
    }
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setShowCreateForm(false);
    setImageFile(null);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price ?? '',
      originalPrice: product.originalPrice ?? '',
      brand: product.brand || '',
      categoryId: product.categoryId ?? product.category?.id ?? '',
      stock: product.stock ?? '',
    });
  };

  const formatPrice = (price) => `Rs. ${parseFloat(price || 0).toLocaleString('en-IN')}`;

  if (loading) {
    return (
      <div className="admin-body">
        <div className="loading">Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-body">
        <div className="page-heading">Products</div>
        <div className="table-box" style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#dc3545', marginBottom: '15px', display: 'block' }}></i>
          <h3 style={{ marginBottom: '10px', color: '#dc3545' }}>Unable to load products</h3>
          <p style={{ color: '#888', marginBottom: '16px' }}>{error}</p>
          <button className="btn-primary" onClick={() => dispatch(fetchProducts({ page, size: 20 }))}>
            <i className="fas fa-sync-alt"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-body">
      <div className="page-heading">Products</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ color: '#888', fontSize: '13px' }}>{products.length} product{products.length === 1 ? '' : 's'}</div>
        <button
          className="btn-primary"
          onClick={() => {
            resetForm();
            setShowCreateForm(true);
          }}
        >
          <i className="fas fa-plus"></i> Add Product
        </button>
      </div>

      {(showCreateForm || editingProduct) && (
        <div className="table-box" style={{ marginBottom: '24px' }}>
          <div className="table-header">
            <span style={{ fontWeight: 600, color: '#ff8c00' }}>
              {editingProduct ? `Edit: ${editingProduct.name}` : 'New Product'}
            </span>
          </div>
          <form onSubmit={handleSubmit} style={{ padding: '20px' }} noValidate>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '15px', marginBottom: '20px' }}>
              <div className="form-group">
                <label>Name <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                <input type="text" className={`form-input${formErrors.name ? ' error' : ''}`} value={formData.name}
                  onChange={(e) => { setFormData({ ...formData, name: e.target.value }); if (formErrors.name) setFormErrors(p => ({ ...p, name: '' })); }} />
                {formErrors.name && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>}
              </div>
              <div className="form-group">
                <label>Category <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                <select className={`form-input${formErrors.categoryId ? ' error' : ''}`} value={formData.categoryId}
                  onChange={(e) => { setFormData({ ...formData, categoryId: e.target.value }); if (formErrors.categoryId) setFormErrors(p => ({ ...p, categoryId: '' })); }}>
                  <option value="">Select category</option>
                  {categoryOptions.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                {formErrors.categoryId && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.categoryId}</span>}
              </div>
              <div className="form-group">
                <label>Price (₹) <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                <input type="number" min="0" step="0.01" className={`form-input${formErrors.price ? ' error' : ''}`} value={formData.price}
                  onChange={(e) => { setFormData({ ...formData, price: e.target.value }); if (formErrors.price) setFormErrors(p => ({ ...p, price: '' })); }} />
                {formErrors.price && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.price}</span>}
              </div>
              <div className="form-group">
                <label>Original Price (₹)</label>
                <input type="number" min="0" step="0.01" className="form-input" placeholder="MRP / before discount" value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Brand</label>
                <input type="text" className="form-input" placeholder="e.g. Samsung" value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Stock <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                <input type="number" min="0" className={`form-input${formErrors.stock ? ' error' : ''}`} value={formData.stock}
                  onChange={(e) => { setFormData({ ...formData, stock: e.target.value }); if (formErrors.stock) setFormErrors(p => ({ ...p, stock: '' })); }} />
                {formErrors.stock && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.stock}</span>}
              </div>
            </div>

            <div className="form-group">
              <label>Description <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <textarea className={`form-input${formErrors.description ? ' error' : ''}`} rows="3" value={formData.description}
                onChange={(e) => { setFormData({ ...formData, description: e.target.value }); if (formErrors.description) setFormErrors(p => ({ ...p, description: '' })); }}
                style={{ resize: 'vertical' }} />
              {formErrors.description && <span style={{ color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' }}>{formErrors.description}</span>}
            </div>

            <div className="form-group">
              <label>Product Image</label>
              <input type="file" accept="image/*" className="form-input" onChange={(e) => {
                const file = e.target.files?.[0] || null;
                setImageFile(file);
              }} />
              {imageFile && <div style={{ color: '#aaa', fontSize: '12px', marginTop: '6px' }}>Selected file: {imageFile.name}</div>}
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button type="submit" className="btn-primary" disabled={submitting}>
                {submitting
                  ? <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                  : <><i className="fas fa-save"></i> {editingProduct ? 'Update' : 'Create'}</>}
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

      {products.length === 0 ? (
        <div className="table-box" style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-box" style={{ fontSize: '48px', color: '#888', marginBottom: '15px', display: 'block' }}></i>
          <p style={{ color: '#888' }}>No products found</p>
          <Link to="/admin/categories" className="btn-primary" style={{ marginTop: '16px' }}>
            <i className="fas fa-th-large"></i> Manage Categories
          </Link>
        </div>
      ) : (
        <>
          <div className="table-box">
            <div style={{ overflowX: 'auto' }}>
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <img
                          src={product.imageUrl || FALLBACK_IMAGE}
                          alt={product.name}
                          style={{ width: '52px', height: '52px', objectFit: 'cover', borderRadius: '6px', background: '#333' }}
                          onError={(event) => {
                            event.currentTarget.onerror = null;
                            event.currentTarget.src = FALLBACK_IMAGE;
                          }}
                        />
                      </td>
                      <td>
                        <div className="td-bold">{product.name}</div>
                        <div className="td-sub">ID: {product.id}</div>
                      </td>
                      <td>{product.categoryName || product.category?.name || product.category || '-'}</td>
                      <td style={{ color: '#ff8c00', fontWeight: 600 }}>{formatPrice(product.price)}</td>
                      <td>
                        <span style={{ color: product.stock > 10 ? '#28a745' : product.stock > 0 ? '#ffc107' : '#dc3545', fontWeight: 600 }}>
                          {product.stock}
                        </span>
                      </td>
                      <td style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <button className="btn-icon" title="Edit" style={{ color: '#007bff' }} onClick={() => startEdit(product)}>
                          <i className="fas fa-edit"></i>
                        </button>
                        <button className="btn-icon" title="Delete" style={{ color: '#dc3545' }} onClick={() => handleDeleteProduct(product.id)}>
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="admin-pagination">
              <button className="pagination-btn" onClick={() => setPage((currentPage) => Math.max(0, currentPage - 1))} disabled={page === 0}>
                Previous
              </button>
              <span className="pagination-info">Page {page + 1} of {totalPages}</span>
              <button className="pagination-btn" onClick={() => setPage((currentPage) => Math.min(totalPages - 1, currentPage + 1))} disabled={page >= totalPages - 1}>
                Next
              </button>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={deleteConfirm.open}
        title="Delete Product"
        message={`Delete "${deleteConfirm.name}"? This cannot be undone.`}
        confirmText="Delete"
        danger={true}
        onConfirm={confirmDeleteProduct}
        onCancel={() => setDeleteConfirm({ open: false, id: null, name: '' })}
      />
    </div>
  );
};

export default AdminProducts;

