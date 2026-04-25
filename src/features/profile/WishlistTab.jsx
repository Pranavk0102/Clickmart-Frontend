import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist } from '../products/wishlistSlice';
import { Link } from 'react-router-dom';
import WishlistCard from '../products/WishlistCard';
import './WishlistTab.css';

const WishlistTab = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.wishlist);

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  if (loading) {
    return <div className="loading">Loading wishlist...</div>;
  }

  return (
    <div className="wishlist-tab">
      <div className="section-head">
        <i className="fas fa-heart"></i>
        My Wishlist
        {items.length > 0 && <span className="count-badge">{items.length}</span>}
      </div>

      {items.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-heart-broken"></i>
          <p>Your wishlist is empty</p>
          <Link to="/products" className="btn-shop">
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((item) => (
            <WishlistCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistTab;
