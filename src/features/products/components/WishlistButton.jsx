import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../slices/wishlistSlice';
import { toast } from 'react-toastify';
import './WishlistButton.css';

const WishlistButton = ({ productId, className = '' }) => {
  const dispatch = useDispatch();
  const { items } = useSelector(state => state.wishlist);
  const isInWishlist = items.some(item => item.productId === productId);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);

    try {
      if (isInWishlist) {
        await dispatch(removeFromWishlist(productId)).unwrap();
        toast.info('Removed from wishlist');
      } else {
        await dispatch(addToWishlist(productId)).unwrap();
        toast.success('Added to wishlist');
      }
    } catch (error) {
      toast.error(error || 'Failed to update wishlist');
    }
  };

  return (
    <button
      className={`wishlist-button ${isInWishlist ? 'active' : ''} ${isAnimating ? 'animating' : ''} ${className}`}
      onClick={handleToggle}
      aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={isInWishlist ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    </button>
  );
};

export default WishlistButton;
