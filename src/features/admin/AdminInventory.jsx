import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../products/productSlice';
import { updateStock } from './adminSlice';
import { toast } from 'react-toastify';

const AdminInventory = () => {
  const dispatch = useDispatch();
  const { items: products, loading, totalPages } = useSelector((state) => state.products);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [addStockModal, setAddStockModal] = useState(null); // { id, name, stock }
  const [addQty, setAddQty] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({ page, size: 20 }));
  }, [dispatch, page]);

  const formatPrice = (price) => `₹${parseFloat(price || 0).toLocaleString('en-IN')}`;

  const getStockStatus = (stock) => {
    if (stock <= 0) return 'out_of_stock';
    if (stock <= 10) return 'low_stock';
    return 'in_stock';
  };

  const getStockColor = (stock) => {
    if (stock <= 0) return '#dc3545';
    if (stock <= 10) return '#ffc107';
    return '#28a745';
  };

  const handleAddStock = async () => {
    const qty = parseInt(addQty);
    if (!qty || qty < 1) { toast.error('Enter a valid quantity'); return; }
    const product = products.find(p => p.id === addStockModal.id);
    if (!product) return;
    const newStock = (product.stock || 0) + qty;
    try {
      await dispatch(updateStock({ productId: product.id, stock: newStock })).unwrap();
      toast.success(`Added ${qty} units to ${product.name}`);
      setAddStockModal(null);
      setAddQty('');
      dispatch(fetchProducts({ page, size: 20 }));
    } catch (err) {
      toast.error(err?.message || 'Failed to update stock');
    }
  };

  const filtered = products.filter(p => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    const status = getStockStatus(p.stock);
    const matchStatus = !statusFilter || status === statusFilter;
    return matchSearch && matchStatus;
  });

  const lowStock = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStock = products.filter(p => p.stock <= 0).length;

  return (
    <div className="admin-body">
      <div className="page-heading">Inventory Management</div>

      <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-boxes"></i></div>
          <div className="stat-info"><div className="stat-label">Total Products</div><div className="stat-value">{products.length}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255,193,7,0.15)', color: '#ffc107' }}><i className="fas fa-exclamation-triangle"></i></div>
          <div className="stat-info"><div className="stat-label">Low Stock</div><div className="stat-value" style={{ color: '#ffc107' }}>{lowStock}</div></div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(220,53,69,0.15)', color: '#dc3545' }}><i className="fas fa-times-circle"></i></div>
          <div className="stat-info"><div className="stat-label">Out of Stock</div><div className="stat-value" style={{ color: '#dc3545' }}>{outOfStock}</div></div>
        </div>
      </div>

      <div className="table-box">
        <div className="table-header">
          <input className="search-input" placeholder="Search by product name..." value={search}
            onChange={(e) => setSearch(e.target.value)} />
          <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Items</option>
            <option value="in_stock">In Stock</option>
            <option value="low_stock">Low Stock</option>
            <option value="out_of_stock">Out of Stock</option>
          </select>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            <i className="fas fa-spinner fa-spin" style={{ fontSize: '28px', display: 'block', marginBottom: '10px' }}></i>
            Loading inventory…
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
            <i className="fas fa-warehouse" style={{ fontSize: '36px', display: 'block', marginBottom: '10px' }}></i>
            No products found
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Current Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        {item.imageUrl && (
                          <img src={item.imageUrl} alt={item.name}
                            style={{ width: '40px', height: '40px', objectFit: 'contain', background: '#333', borderRadius: '5px', padding: '3px' }}
                            onError={(e) => { e.target.style.display = 'none'; }} />
                        )}
                        <div>
                          <div className="td-bold">{item.name}</div>
                          <div className="td-sub">ID: {item.id}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#aaa' }}>{item.categoryName || '—'}</td>
                    <td style={{ color: '#ff8c00', fontWeight: 600 }}>{formatPrice(item.price)}</td>
                    <td>
                      <span style={{ color: getStockColor(item.stock), fontWeight: '700', fontSize: '15px' }}>
                        {item.stock ?? 0}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge status-${getStockStatus(item.stock)}`}>
                        {getStockStatus(item.stock).replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <button className="btn-outline-sm"
                        onClick={() => { setAddStockModal({ id: item.id, name: item.name, stock: item.stock || 0 }); setAddQty(''); }}>
                        <i className="fas fa-plus"></i> Add Stock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="admin-pagination">
            <button className="pagination-btn" onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}>Previous</button>
            <span className="pagination-info">Page {page + 1} of {totalPages}</span>
            <button className="pagination-btn" onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}>Next</button>
          </div>
        )}
      </div>

      {/* Add Stock Modal */}
      {addStockModal && (
        <div className="modal-overlay open" onClick={() => setAddStockModal(null)}>
          <div className="modal-box" style={{ width: '380px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-title"><i className="fas fa-plus-circle"></i> Add Stock</div>
            <button className="modal-close" onClick={() => setAddStockModal(null)}><i className="fas fa-times"></i></button>
            <div style={{ fontWeight: '600', marginBottom: '4px', color: '#fff' }}>{addStockModal.name}</div>
            <div style={{ background: '#1a1a1a', borderRadius: '6px', padding: '12px 16px', marginBottom: '16px', fontSize: '13px' }}>
              Current Stock: <strong style={{ color: '#ff8c00' }}>{addStockModal.stock}</strong> units
            </div>
            <div className="form-group">
              <label>Add Quantity</label>
              <input type="number" className="form-input" min="1" placeholder="Enter quantity to add"
                value={addQty} onChange={(e) => setAddQty(e.target.value)} />
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleAddStock}>
                <i className="fas fa-check"></i> Confirm
              </button>
              <button onClick={() => setAddStockModal(null)}
                style={{ flex: 1, background: '#333', border: '1px solid #444', color: '#aaa', padding: '8px', borderRadius: '5px', cursor: 'pointer', fontFamily: 'Poppins,sans-serif' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInventory;
