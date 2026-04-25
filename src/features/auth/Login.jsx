import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, register, clearError } from './authSlice';
import { toast } from 'react-toastify';

const errStyle = { color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' };

const Login = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loginErrors, setLoginErrors] = useState({});
  const [registerData, setRegisterData] = useState({
    firstName: '', lastName: '', email: '', phone: '', password: '', confirmPassword: ''
  });
  const [regErrors, setRegErrors] = useState({});

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(user.role?.toUpperCase() === 'ADMIN' ? '/admin' : '/');
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) { toast.error(error); dispatch(clearError()); }
  }, [error, dispatch]);

  const validateLogin = () => {
    const errs = {};
    if (!loginData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email)) errs.email = 'Enter a valid email address';
    if (!loginData.password) errs.password = 'Password is required';
    return errs;
  };

  const validateRegister = () => {
    const errs = {};
    if (!registerData.firstName.trim()) errs.firstName = 'First name is required';
    else if (registerData.firstName.trim().length < 2) errs.firstName = 'Min 2 characters';
    if (!registerData.lastName.trim()) errs.lastName = 'Last name is required';
    else if (registerData.lastName.trim().length < 2) errs.lastName = 'Min 2 characters';
    if (!registerData.email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerData.email)) errs.email = 'Enter a valid email address';
    if (!registerData.phone.trim()) errs.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(registerData.phone)) errs.phone = 'Phone must be exactly 10 digits';
    if (!registerData.password) errs.password = 'Password is required';
    else if (registerData.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (!registerData.confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (registerData.password !== registerData.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    const errs = validateLogin();
    if (Object.keys(errs).length) { setLoginErrors(errs); return; }
    setLoginErrors({});
    try {
      const result = await dispatch(login(loginData)).unwrap();
      toast.success('Login successful!');
      navigate(result.user.role?.toUpperCase() === 'ADMIN' ? '/admin' : '/');
    } catch { /* handled by useEffect */ }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    const errs = validateRegister();
    if (Object.keys(errs).length) { setRegErrors(errs); return; }
    setRegErrors({});
    try {
      const result = await dispatch(register(registerData)).unwrap();
      toast.success('Registration successful!');
      navigate(result.user.role?.toUpperCase() === 'ADMIN' ? '/admin' : '/');
    } catch { /* handled by useEffect */ }
  };

  const setLoginField = (field, value) => {
    setLoginData(prev => ({ ...prev, [field]: value }));
    if (loginErrors[field]) setLoginErrors(prev => ({ ...prev, [field]: '' }));
  };

  const setRegField = (field, value) => {
    setRegisterData(prev => ({ ...prev, [field]: value }));
    if (regErrors[field]) setRegErrors(prev => ({ ...prev, [field]: '' }));
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={`auth-tab ${activeTab === 'login' ? 'active' : ''}`} onClick={() => setActiveTab('login')}>Login</button>
          <button className={`auth-tab ${activeTab === 'register' ? 'active' : ''}`} onClick={() => setActiveTab('register')}>Sign Up</button>
        </div>

        <div className="auth-body">
          {activeTab === 'login' ? (
            <>
              <div className="auth-title">Welcome Back</div>
              <div className="auth-subtitle">Please enter your account details</div>
              <form onSubmit={handleLoginSubmit} noValidate>
                <div className="form-group">
                  <label>Email <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                  <input type="email" className={`form-input${loginErrors.email ? ' error' : ''}`}
                    placeholder="you@example.com" value={loginData.email}
                    onChange={(e) => setLoginField('email', e.target.value)} />
                  {loginErrors.email && <span style={errStyle}>{loginErrors.email}</span>}
                </div>
                <div className="form-group">
                  <label>Password <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                  <input type="password" className={`form-input${loginErrors.password ? ' error' : ''}`}
                    placeholder="Enter password" value={loginData.password}
                    onChange={(e) => setLoginField('password', e.target.value)} />
                  {loginErrors.password && <span style={errStyle}>{loginErrors.password}</span>}
                </div>
                <button type="submit" className="btn-orange" style={{ width: '100%', padding: '12px' }} disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px', color: '#888' }}>
                  Don't have an account?{' '}
                  <button type="button" onClick={() => setActiveTab('register')} style={{ background: 'none', border: 'none', color: '#ff8c00', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '13px' }}>
                    Sign Up
                  </button>
                </p>
              </form>
            </>
          ) : (
            <>
              <div className="auth-title">Create Account</div>
              <div className="auth-subtitle">Join ClickMart today</div>
              <form onSubmit={handleRegisterSubmit} noValidate>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div className="form-group">
                    <label>First Name <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                    <input type="text" className={`form-input${regErrors.firstName ? ' error' : ''}`}
                      placeholder="First name" value={registerData.firstName}
                      onChange={(e) => setRegField('firstName', e.target.value)} />
                    {regErrors.firstName && <span style={errStyle}>{regErrors.firstName}</span>}
                  </div>
                  <div className="form-group">
                    <label>Last Name <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                    <input type="text" className={`form-input${regErrors.lastName ? ' error' : ''}`}
                      placeholder="Last name" value={registerData.lastName}
                      onChange={(e) => setRegField('lastName', e.target.value)} />
                    {regErrors.lastName && <span style={errStyle}>{regErrors.lastName}</span>}
                  </div>
                </div>
                <div className="form-group">
                  <label>Email <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                  <input type="email" className={`form-input${regErrors.email ? ' error' : ''}`}
                    placeholder="you@example.com" value={registerData.email}
                    onChange={(e) => setRegField('email', e.target.value)} />
                  {regErrors.email && <span style={errStyle}>{regErrors.email}</span>}
                </div>
                <div className="form-group">
                  <label>Phone <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                  <input type="tel" className={`form-input${regErrors.phone ? ' error' : ''}`}
                    placeholder="10-digit mobile number" maxLength="10" value={registerData.phone}
                    onChange={(e) => setRegField('phone', e.target.value.replace(/\D/g, ''))} />
                  {regErrors.phone && <span style={errStyle}>{regErrors.phone}</span>}
                </div>
                <div className="form-group">
                  <label>Password <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                  <input type="password" className={`form-input${regErrors.password ? ' error' : ''}`}
                    placeholder="Min 6 characters" value={registerData.password}
                    onChange={(e) => setRegField('password', e.target.value)} />
                  {regErrors.password && <span style={errStyle}>{regErrors.password}</span>}
                </div>
                <div className="form-group">
                  <label>Confirm Password <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                  <input type="password" className={`form-input${regErrors.confirmPassword ? ' error' : ''}`}
                    placeholder="Confirm your password" value={registerData.confirmPassword}
                    onChange={(e) => setRegField('confirmPassword', e.target.value)} />
                  {regErrors.confirmPassword && <span style={errStyle}>{regErrors.confirmPassword}</span>}
                </div>
                <button type="submit" className="btn-orange" style={{ width: '100%', padding: '12px' }} disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'}
                </button>
                <p style={{ textAlign: 'center', marginTop: '15px', fontSize: '13px', color: '#888' }}>
                  Already have an account?{' '}
                  <button type="button" onClick={() => setActiveTab('login')} style={{ background: 'none', border: 'none', color: '#ff8c00', cursor: 'pointer', fontFamily: 'Poppins,sans-serif', fontSize: '13px' }}>
                    Login
                  </button>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
