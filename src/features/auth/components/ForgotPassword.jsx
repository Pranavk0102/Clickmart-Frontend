import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPassword, resetPassword } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';

const errStyle = { color: '#dc3545', fontSize: '12px', marginTop: '4px', display: 'block' };

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((state) => state.auth);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    
    setError('');
    
    try {
      await dispatch(forgotPassword(email)).unwrap();
      setStep(2);
      toast.success('6-digit OTP sent to your email');
    } catch (err) {
      toast.error(err || 'Failed to send OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!otp.trim()) {
      setError('OTP is required');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setError('');
    
    try {
      await dispatch(resetPassword({ token: otp.trim(), newPassword })).unwrap();
      toast.success('Password reset successfully! You can now login.');
      navigate('/login');
    } catch (err) {
      setError(err || 'Failed to reset password');
      toast.error(err || 'Failed to reset password');
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '400px' }}>
        <div className="auth-body">
          <div className="auth-title">Forgot Password</div>
          
          {step === 1 ? (
            <>
              <div className="auth-subtitle">
                Enter your email and we'll send you a 6-digit OTP to reset your password.
              </div>
              <form onSubmit={handleSendOtp} noValidate>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    className={`form-input${error && !email ? ' error' : ''}`}
                    placeholder="you@example.com" 
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(''); }} 
                  />
                  {error && <span style={errStyle}>{error}</span>}
                </div>
                
                <button 
                  type="submit" 
                  className="btn-orange" 
                  style={{ width: '100%', padding: '12px', marginTop: '10px' }} 
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Send OTP'}
                </button>
                
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <Link to="/login" style={{ color: '#ff8c00', fontSize: '13px', textDecoration: 'none' }}>
                    <i className="fas fa-arrow-left"></i> Back to Login
                  </Link>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="auth-subtitle" style={{ color: '#28a745' }}>
                OTP sent to {email}. It will expire in 10 minutes.
              </div>
              <form onSubmit={handleResetPassword} noValidate>
                <div className="form-group">
                  <label>Enter 6-Digit OTP</label>
                  <input 
                    type="text" 
                    className={`form-input${error && error.includes('OTP') ? ' error' : ''}`}
                    placeholder="123456" 
                    value={otp}
                    onChange={(e) => { setOtp(e.target.value); setError(''); }} 
                  />
                </div>
                
                <div className="form-group">
                  <label>New Password</label>
                  <input 
                    type="password" 
                    className="form-input"
                    placeholder="At least 6 characters" 
                    value={newPassword}
                    onChange={(e) => { setNewPassword(e.target.value); setError(''); }} 
                  />
                </div>

                <div className="form-group">
                  <label>Confirm New Password</label>
                  <input 
                    type="password" 
                    className="form-input"
                    placeholder="Confirm password" 
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }} 
                  />
                  {error && <span style={errStyle}>{error}</span>}
                </div>
                
                <button 
                  type="submit" 
                  className="btn-orange" 
                  style={{ width: '100%', padding: '12px', marginTop: '10px' }} 
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
                
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  <button type="button" onClick={() => { setStep(1); setError(''); }} style={{ background: 'none', border: 'none', color: '#ff8c00', fontSize: '13px', cursor: 'pointer', textDecoration: 'none' }}>
                    <i className="fas fa-envelope"></i> Change Email
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
