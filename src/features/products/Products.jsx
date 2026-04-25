import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from './productSlice';
import { fetchCategories } from './categorySlice';
import ProductCard from './ProductCard';
import FilterSidebar from './FilterSidebar';
import './Products.css';

const Products = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items: products, loading, totalPages, currentPage } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);
  
  const [page, setPage] = useState(0);
  const [filters, setFilters] = useState({
    brands: [],
    discount: null,
    rating: null,
    priceRange: [0, 100000],
  });
  const [sortBy, setSortBy] = useState('id,desc');

  const search = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const categoryIdParam = searchParams.get('categoryId') || '';

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories.length]);

  useEffect(() => {
    // eslint-disable-next-line
    setPage(0);
  }, [search, categoryParam, categoryIdParam]);

  useEffect(() => {
    const fetchParams = { page, size: 20, sort: sortBy };
    
    if (search) {
      fetchParams.search = search;
    }

    if (categoryIdParam) {
      fetchParams.categoryId = parseInt(categoryIdParam, 10);
    } else if (categoryParam && categories.length > 0) {
      const matchedCat = categories.find(
        c => c.name.toLowerCase() === categoryParam.toLowerCase()
      );
      if (matchedCat) {
        fetchParams.categoryId = matchedCat.id;
      } else {
        fetchParams.search = fetchParams.search
          ? `${fetchParams.search} ${categoryParam}`
          : categoryParam;
      }
    }

    dispatch(fetchProducts(fetchParams));
  }, [dispatch, page, search, categoryParam, categoryIdParam, sortBy, categories]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const categoryDisplayName = (() => {
    if (categoryParam) return categoryParam;
    if (categoryIdParam && categories.length > 0) {
      const cat = categories.find(c => c.id === parseInt(categoryIdParam, 10));
      return cat?.name || '';
    }
    return '';
  })();

  const filteredProducts = products.filter((product) => {
    if (filters.brands.length > 0 && !filters.brands.includes(product.brand)) {
      return false;
    }

    if (filters.discount) {
      const disc = product.originalPrice > product.price
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : 0;
      if (disc < filters.discount) return false;
    }

    if (filters.rating && (product.rating || 0) < filters.rating) {
      return false;
    }

    if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
      return false;
    }

    return true;
  });

  let productView = null;
  if (loading) {
    productView = <div className="loading">Loading products...</div>;
  } else {
    let mainContent = null;
    if (filteredProducts.length === 0) {
      mainContent = (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <i className="fas fa-box-open" style={{ fontSize: '48px', marginBottom: '16px', display: 'block' }}></i>
          <p>No products found matching your filters</p>
        </div>
      );
    } else {
      let paginationControls = null;
      if (totalPages > 1) {
        paginationControls = (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '30px' }}>
            <button
              className="btn-outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              style={{ opacity: currentPage === 0 ? 0.5 : 1 }}
            >
              <i className="fas fa-chevron-left"></i> Previous
            </button>
            <span style={{ padding: '8px 16px', color: '#ff8c00' }}>
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              className="btn-outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              style={{ opacity: currentPage >= totalPages - 1 ? 0.5 : 1 }}
            >
              Next <i className="fas fa-chevron-right"></i>
            </button>
          </div>
        );
      }

      mainContent = (
        <>
          <div className="products-grid">
            {filteredProducts.map((product) => {
              return <ProductCard key={product.id} product={product} />;
            })}
          </div>
          {paginationControls}
        </>
      );
    }

    productView = (
      <div className="products-layout">
        {/* Filter Sidebar */}
        <FilterSidebar products={products} onFilterChange={handleFilterChange} />

        <div className="products-content">
          {/* Result bar */}
          <div className="result-bar">
            <div className="result-count">
              Showing {filteredProducts.length} of {products.length} products
              {search && (
                <button
                  onClick={() => navigate('/products')}
                  style={{ marginLeft: '12px', background: 'none', border: '1px solid #555', color: '#aaa', padding: '3px 10px', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', fontFamily: 'Poppins,sans-serif' }}
                >
                  <i className="fas fa-times"></i> Clear "{search}"
                </button>
              )}
            </div>
            <div className="sort-dropdown">
              <label>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                <option value="id,desc">Newest First</option>
                <option value="price,asc">Price: Low to High</option>
                <option value="price,desc">Price: High to Low</option>
                <option value="name,asc">Name: A to Z</option>
                <option value="rating,desc">Rating: High to Low</option>
              </select>
            </div>
          </div>
          {mainContent}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="breadcrumb">
        <a href="/">Home</a>
        <span>/</span>
        <span>Products</span>
        {categoryDisplayName && (
          <>
            <span>/</span>
            <span>{categoryDisplayName}</span>
          </>
        )}
        {search && (
          <>
            <span>/</span>
            <span>Search: &quot;{search}&quot;</span>
          </>
        )}
      </div>

      <div className="section-title">
        {search ? `Search Results for "${search}"` : categoryDisplayName || 'All Products'}
      </div>

      {productView}
    </div>
  );
};

export default Products;
