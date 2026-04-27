import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdmin, selectIsAuthenticated } from '../slices/authSlice';

const AdminRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="container">
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <i className="fas fa-lock" style={{ fontSize: '64px', color: '#dc3545', marginBottom: '20px', display: 'block' }}></i>
          <h2 style={{ marginBottom: '10px', color: '#dc3545' }}>Access Denied</h2>
          <p style={{ color: '#888', marginBottom: '20px' }}>You don't have permission to access this page</p>
          <a href="/" className="btn-orange">Go to Home</a>
        </div>
      </div>
    );
  }

  return children;
};

export default AdminRoute;
