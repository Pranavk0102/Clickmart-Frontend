import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './AdminTopBar';
import '../../styles/admin.css';

const AdminLayout = () => {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminTopBar />
        <div className="admin-body">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
