import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../cart/slices/cartSlice';
import { toast } from 'react-toastify';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const formatPrice = (price) => {
    return `₹${parseFloat(price).toLocaleString('en-IN')}`;
  };

  const handleAddToCart = async (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.info('Please login to add items to cart');
      navigate('/login');
      return;
    }
    try {
      await dispatch(addToCart({ productId: product.id, quantity: 1 })).unwrap();
      toast.success('Added to cart!');
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to add to cart');
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <div className="product-img">
        <img
          src={product.imageUrl || '/placeholder.png'}
          alt={product.name}
          loading="lazy"
          onError={(e) => { e.target.src = 'https://via.placeholder.com/160x160?text=No+Image'; }}
        />
      </div>
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div>
          <span className="product-price">{formatPrice(product.price)}</span>
          {product.originalPrice > product.price && (
            <span className="product-mrp">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        {discount > 0 && (
          <div className="product-discount">{discount}% off</div>
        )}
        <button
          className="btn-orange"
          style={{ width: '100%', marginTop: '8px', padding: '7px' }}
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
