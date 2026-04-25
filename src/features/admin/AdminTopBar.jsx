import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../auth/authSlice';
import { toast } from 'react-toastify';

const AdminTopBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      toast.success('Logged out successfully!');
      navigate('/login');
    } catch {
      toast.error('Logout failed');
    }
  };

  return (
    <>
      <div className="admin-topbar">
        <div className="topbar-title">
          HELLO <span>{user?.firstName?.toUpperCase() || 'ADMIN'}</span>!
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="btn-logout" onClick={() => setShowConfirm(true)}>
            <i className="fas fa-sign-out-alt"></i> Logout
          </button>
        </div>
      </div>

      {/* Logout Confirmation */}
      {showConfirm && (
        <div 
          className="modal-overlay open" 
          onClick={() => setShowConfirm(false)}
        >
          <div 
            className="modal-box" 
            style={{ maxWidth: '360px', textAlign: 'center' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ fontSize: '40px', marginBottom: '12px', color: '#ff8c00' }}>
              <i className="fas fa-sign-out-alt"></i>
            </div>
            <div style={{ color: '#fff', fontSize: '15px', marginBottom: '22px', lineHeight: '1.6' }}>
              Logout from admin panel?
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button 
                className="btn-primary" 
                style={{ flex: 1 }}
                onClick={handleLogout}
              >
                Logout
              </button>
              <button 
                style={{ 
                  flex: 1, 
                  background: '#333', 
                  border: '1px solid #444', 
                  color: '#aaa', 
                  padding: '8px', 
                  borderRadius: '5px', 
                  cursor: 'pointer', 
                  fontFamily: 'Poppins, sans-serif' 
                }}
                onClick={() => setShowConfirm(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTopBar;
