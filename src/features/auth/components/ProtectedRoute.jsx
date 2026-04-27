import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAdmin } from '../slices/authSlice';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const isAdmin = useSelector(selectIsAdmin);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isAdmin && (
    location.pathname.startsWith('/profile') ||
    location.pathname.startsWith('/orders') ||
    location.pathname.startsWith('/checkout') ||
    location.pathname.startsWith('/order-success')
  )) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
