import { NavLink } from 'react-router-dom';

const AdminSidebar = () => {
  const menuItems = [
    { path: '/admin', icon: 'fa-tachometer-alt', label: 'Admin Dashboard', exact: true },
    { path: '/admin/customers', icon: 'fa-users', label: 'Customers' },
    { path: '/admin/categories', icon: 'fa-th-large', label: 'Categories' },
    { path: '/admin/coupons', icon: 'fa-tag', label: 'Coupons' },
    { path: '/admin/products', icon: 'fa-box', label: 'Products' },
    { path: '/admin/orders', icon: 'fa-shopping-bag', label: 'Orders' },
    { path: '/admin/inventory', icon: 'fa-warehouse', label: 'Inventory' },
    { path: '/admin/tickets', icon: 'fa-headset', label: 'Support Tickets' },
  ];

  return (
    <aside className="admin-sidebar">
      <div className="sidebar-logo">
        CLICK<span>MART</span>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) => 
              `sidebar-item ${isActive ? 'active' : ''}`
            }
          >
            <i className={`fas ${item.icon}`}></i>
            <span className="item-label">{item.label}</span>
            <i className="fas fa-chevron-right chevron"></i>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default AdminSidebar;
