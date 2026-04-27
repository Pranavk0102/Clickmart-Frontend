import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../products/slices/productSlice';
import { fetchCategories } from '../../products/slices/categorySlice';
import ProductCard from '../../products/components/ProductCard';
import HeroBanner from './HeroBanner';

const categories = [
  { name: 'Electronics', icon: 'fa-laptop', param: 'Electronics' },
  { name: 'Fashion', icon: 'fa-tshirt', param: 'Fashion' },
  { name: 'Beauty', icon: 'fa-spa', param: 'Health and Beauty' },
  { name: 'Home', icon: 'fa-home', param: 'Home and Garden' },
  { name: 'Sports', icon: 'fa-dumbbell', param: 'Sports' },
  { name: 'Toys', icon: 'fa-gamepad', param: 'Toys and Games' },
  { name: 'Books', icon: 'fa-book', param: 'Books' },
  { name: 'Automotive', icon: 'fa-car', param: 'Automotive' },
];

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?.role?.toUpperCase() === 'ADMIN') {
      navigate('/admin');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    dispatch(fetchProducts({ page: 0, size: 20, sort: 'relevance' }));
    dispatch(fetchCategories());
  }, [dispatch]);

  const popularProducts = products.slice(0, 5);
  const newArrivals = products.slice(2, 10);

  return (
    <div className="container">
      {/* Hero Banner */}
      <HeroBanner
        title="Welcome to <span>ClickMart</span>"
        subtitle="Your one-stop destination for all your shopping needs. Quality products at unbeatable prices."
        ctaText="Shop Now"
        ctaLink="/products"
      />

      {/* Banner */}
      <div className="banner" style={{ marginTop: '20px' }}>
        <div className="banner-text">
          <h3>🎉 Raksha Bandhan Special</h3>
          <h1>SALE</h1>
          <p>LIMITED TIME ONLY</p>
          <Link to="/products" className="btn-orange" style={{ display: 'inline-block', padding: '10px 24px' }}>
            Shop Now
          </Link>
        </div>
        <div className="banner-badge">
          <div className="big">50%</div>
          <div className="small">OFF</div>
        </div>
      </div>

      {/* Categories */}
      <div className="section-title">Shop by Category</div>
      <div className="categories-row">
        {categories.map((cat) => (
          <Link
            key={cat.param}
            to={`/products?category=${cat.param}`}
            className="category-chip"
          >
            <i className={`fas ${cat.icon}`}></i> {cat.name}
          </Link>
        ))}
      </div>

      {/* Popular Products */}
      <div className="section-title">Popular Products ▶</div>
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          {popularProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {/* New Arrivals */}
      <div className="section-title">New Arrivals</div>
      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <div className="products-grid">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
