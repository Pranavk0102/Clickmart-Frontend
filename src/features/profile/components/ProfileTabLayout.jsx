import { useSelector } from 'react-redux';
import './ProfileTabLayout.css';

const ProfileTabLayout = ({ children, activeTab, onTabChange }) => {
  const { user } = useSelector((state) => state.auth);

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: 'fas fa-user' },
    { id: 'addresses', label: 'Addresses', icon: 'fas fa-map-marker-alt' },
    { id: 'orders', label: 'My Orders', icon: 'fas fa-shopping-bag' },
    // { id: 'wishlist', label: 'Wishlist', icon: 'fas fa-heart' },
    { id: 'notifications', label: 'Notifications', icon: 'fas fa-bell' },
    { id: 'tickets', label: 'Support Tickets', icon: 'fas fa-headset' },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="profile-layout">
      <aside className="profile-sidebar">
        <div className="profile-avatar">
          <div className="avatar-circle">{getInitials(user?.name || user?.firstName)}</div>
          <div className="avatar-name">{user?.name || `${user?.firstName} ${user?.lastName}`}</div>
          <div className="avatar-email">{user?.email}</div>
        </div>
        <nav className="profile-nav">
          {tabs.map((tab) => (
            <a
              key={tab.id}
              className={`sidebar-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <i className={tab.icon}></i>
              <span className="item-label">{tab.label}</span>
              <i className="fas fa-chevron-right chevron"></i>
            </a>
          ))}
        </nav>
      </aside>
      <main className="profile-main">{children}</main>
    </div>
  );
};

export default ProfileTabLayout;
