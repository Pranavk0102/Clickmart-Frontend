import { useEffect } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/slices/authSlice';
import { selectIsAdmin } from '../../features/auth/slices/authSlice';
import { fetchCart } from '../../features/cart/slices/cartSlice';
import { fetchUnreadCount } from '../../features/profile/slices/notificationSlice';
import { fetchAddresses } from '../../features/profile/slices/addressSlice';
import { getHomeRoute } from '../../utils/roleRedirect';
import { toast } from 'react-toastify';
import SearchBar from '../common/SearchBar';
import DeliverToModal from '../common/DeliverToModal';

const Navbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const isAdmin = useSelector(selectIsAdmin);
  const { items: cartItems } = useSelector((state) => state.cart);
  const { unreadCount } = useSelector((state) => state.notifications);
  const { addresses } = useSelector((state) => state.addresses);
  const [deliverModalOpen, setDeliverModalOpen] = React.useState(false);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
      dispatch(fetchUnreadCount());
      dispatch(fetchAddresses());
    }
  }, [dispatch, isAuthenticated]);

  const handleSearch = (query) => {
    navigate(`/products?search=${encodeURIComponent(query)}`);
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  const handleLogoClick = (e) => {
    e.preventDefault();
    const homeRoute = getHomeRoute(user);
    navigate(homeRoute);
  };

  let notificationBadge = null;
  if (unreadCount > 0) {
    let countDisplay = unreadCount;
    if (unreadCount > 9) {
      countDisplay = '9+';
    }
    notificationBadge = (
      <span className="cart-count" style={{ background: '#dc3545' }}>
        {countDisplay}
      </span>
    );
  }

  let cartBadge = null;
  if (cartCount > 0) {
    let countDisplay = cartCount;
    if (cartCount > 99) {
      countDisplay = '99+';
    }
    cartBadge = (
      <span className="cart-count">{countDisplay}</span>
    );
  }

  let authButtons = null;
  if (!isAuthenticated) {
    authButtons = (
      <Link to="/login" className="btn-orange">
        Login / Signup
      </Link>
    );
  } else {
    let adminButton = null;
    if (isAdmin) {
      adminButton = (
        <Link to="/admin" className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className="fas fa-user-shield"></i> Admin
        </Link>
      );
    }

    let userName = 'Profile';
    if (user && user.firstName) {
      userName = user.firstName;
    }

    authButtons = (
      <>
        {adminButton}
        <Link to="/profile" className="btn-orange" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <i className="fas fa-user-circle"></i> {userName}
        </Link>
        <Link to="/profile#notifications" style={{ position: 'relative', color: '#aaa', fontSize: '20px', textDecoration: 'none' }} title="Notifications">
          <i className="fas fa-bell"></i>
          {notificationBadge}
        </Link>
        <button
          onClick={handleLogout}
          className="btn-outline"
          style={{ color: '#ff4444', borderColor: '#ff4444' }}
        >
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </>
    );
  }

  return (
    <>
      <nav className="navbar">
        <a href="/" onClick={handleLogoClick} className="logo">
          CLICK<span>MART</span>
        </a>

        <button className="menu-btn" onClick={onMenuToggle}>
          <i className="fas fa-bars"></i>
        </button>

        <div className="search-box" style={{ flex: 1, maxWidth: '500px' }}>
          <SearchBar
            placeholder="Search for products..."
            onSearch={handleSearch}
          />
        </div>

        <div className="nav-buttons">
          <button className="btn-outline" style={{ fontSize: '12px' }} onClick={() => setDeliverModalOpen(true)}>
            <i className="fas fa-map-marker-alt"></i> Deliver To
          </button>
          {authButtons}
          <Link to="/cart" className="cart-link" style={{ position: 'relative' }}>
            <i className="fas fa-shopping-cart"></i>
            {cartBadge}
          </Link>
        </div>
      </nav>

      <DeliverToModal
        isOpen={deliverModalOpen}
        onClose={() => setDeliverModalOpen(false)}
        addresses={addresses}
        onSelectAddress={() => setDeliverModalOpen(false)}
        onAddNew={() => { setDeliverModalOpen(false); navigate('/profile'); }}
      />
    </>
  );
};

export default Navbar;
