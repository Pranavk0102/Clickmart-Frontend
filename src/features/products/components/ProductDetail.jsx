import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, clearCurrentProduct } from '../slices/productSlice';
import { addToCart } from '../../cart/slices/cartSlice';
import ProductImageGallery from './ProductImageGallery';
import CouponChip from '../../checkout/components/CouponChip';
// import WishlistButton from './WishlistButton';
import RelatedProducts from './RelatedProducts';
import { toast } from 'react-toastify';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentProduct: product, currentProductLoading: loading } = useSelector((state) => state.products);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    return () => {
      dispatch(clearCurrentProduct());
    };
  }, [dispatch, id]);

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to add to cart');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ color: '#888' }}>Product not found</p>
          <Link to="/products" className="btn-orange" style={{ marginTop: '20px', display: 'inline-block' }}>
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const productImages = [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
  ].filter(Boolean);

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail-layout">
        {/* Left: Image Gallery */}
        <div className="product-gallery-section">
          <ProductImageGallery images={productImages} productName={product.name} />
          {/* <WishlistButton productId={product.id} className="wishlist-btn-detail" /> */}
        </div>

        {/* Right: Product Info */}
        <div className="product-info-section">
          <h1 className="product-title">{product.name}</h1>
          
          {product.brand && (
            <div className="product-brand">
              Brand: <span>{product.brand}</span>
            </div>
          )}

          <div className="product-rating">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <i
                  key={i}
                  className={`fas fa-star ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`}
                ></i>
              ))}
            </div>
            <span className="rating-text">
              {product.rating || 0} ({product.reviewCount || 0} reviews)
            </span>
          </div>

          <div className="product-price-section">
            <div className="current-price">{formatPrice(product.price)}</div>
            {product.originalPrice > product.price && (
              <>
                <div className="original-price">{formatPrice(product.originalPrice)}</div>
                <div className="discount-badge">{discount}% OFF</div>
              </>
            )}
          </div>

          {/* Coupon Section */}
          {discount > 0 && (
            <div className="coupon-section">
              <CouponChip
                code="SAVE10"
                discount={10}
                description="Get extra 10% off on this product"
              />
            </div>
          )}

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description || 'No description available for this product.'}</p>
          </div>

          {/* Stock Status */}
          <div className="stock-status">
            {product.stock > 0 ? (
              <span className="in-stock">
                <i className="fas fa-check-circle"></i> In Stock ({product.stock} available)
              </span>
            ) : (
              <span className="out-of-stock">
                <i className="fas fa-times-circle"></i> Out of Stock
              </span>
            )}
          </div>

          {/* Quantity Selector */}
          {product.stock > 0 && (
            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  <i className="fas fa-minus"></i>
                </button>
                <input type="number" value={quantity} readOnly />
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  disabled={quantity >= product.stock}
                >
                  <i className="fas fa-plus"></i>
                </button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button
              className="btn-add-to-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              <i className="fas fa-shopping-cart"></i> Add to Cart
            </button>
            <button
              className="btn-buy-now"
              disabled={product.stock === 0}
              onClick={async () => {
                if (!isAuthenticated) {
                  toast.info('Please login to add items to cart');
                  navigate('/login');
                  return;
                }
                try {
                  await dispatch(addToCart({ productId: product.id, quantity })).unwrap();
                  navigate('/cart');
                } catch (error) {
                  toast.error(typeof error === 'string' ? error : 'Failed to add to cart');
                }
              }}
            >
              <i className="fas fa-bolt"></i> Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Related Products */}
      <RelatedProducts
        categoryId={product.categoryId}
        currentProductId={product.id}
        limit={4}
      />
    </div>
  );
};

export default ProductDetail;
