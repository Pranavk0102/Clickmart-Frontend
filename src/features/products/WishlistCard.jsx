import { useDispatch } from 'react-redux';
import { removeFromWishlist } from './wishlistSlice';
import { addToCart } from '../cart/cartSlice';
import { toast } from 'react-toastify';
import './WishlistCard.css';

const WishlistCard = ({ item }) => {
  const dispatch = useDispatch();

  const handleAddToCart = async () => {
    try {
      await dispatch(addToCart({ productId: item.productId, quantity: 1 })).unwrap();
      toast.success('Added to cart');
    } catch (error) {
      toast.error(error || 'Failed to add to cart');
    }
  };

  const handleRemove = async () => {
    try {
      await dispatch(removeFromWishlist(item.productId)).unwrap();
      toast.info('Removed from wishlist');
    } catch (error) {
      toast.error(error || 'Failed to remove from wishlist');
    }
  };

  return (
    <div className="wishlist-card">
      <img 
        src={item.image || '/placeholder.jpg'} 
        alt={item.name}
        onError={(e) => { e.target.src = '/placeholder.jpg'; }}
      />
      <div className="wishlist-card-body">
        <div className="wishlist-card-name" title={item.name}>
          {item.name}
        </div>
        <div className="wishlist-card-price">
          ₹{parseFloat(item.price).toLocaleString('en-IN')}
        </div>
        <div className="wishlist-card-actions">
          <button className="btn-wish-cart" onClick={handleAddToCart}>
            <i className="fas fa-shopping-cart"></i> Add to Cart
          </button>
          <button className="btn-wish-remove" onClick={handleRemove}>
            <i className="fas fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WishlistCard;
