import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfile } from '../auth/authSlice';
import './PersonalInfoTab.css';

const PersonalInfoTab = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateProfile(formData)).unwrap();
      toast.success('Profile updated successfully');
      setIsEditing(false);
    } catch (error) {
      toast.error(error || 'Failed to update profile');
    }
  };

  return (
    <div className="personal-info-tab">
      <div className="section-head">
        <i className="fas fa-user"></i>
        Personal Information
      </div>

      {!isEditing ? (
        <div className="info-display">
          <div className="info-row">
            <div className="info-item">
              <label>First Name</label>
              <div className="info-value">{user?.firstName || 'Not provided'}</div>
            </div>
            <div className="info-item">
              <label>Last Name</label>
              <div className="info-value">{user?.lastName || 'Not provided'}</div>
            </div>
          </div>

          <div className="info-row">
            <div className="info-item">
              <label>Email Address</label>
              <div className="info-value">{user?.email}</div>
            </div>
            <div className="info-item">
              <label>Phone Number</label>
              <div className="info-value">{user?.phone || 'Not provided'}</div>
            </div>
          </div>

          <button
            className="btn-save"
            onClick={() => {
              setFormData({
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                email: user?.email || '',
                phone: user?.phone || '',
              });
              setIsEditing(true);
            }}
          >
            <i className="fas fa-edit"></i> Edit Profile
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="info-form">
          <div className="form-row">
            <div className="form-group">
              <label>First Name <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <input
                type="text"
                className="form-input"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <input
                type="text"
                className="form-input"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email Address <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                disabled
              />
              <small style={{ color: '#666', fontSize: '11px' }}>Email cannot be changed</small>
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                maxLength="10"
                placeholder="10-digit mobile number"
              />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setFormData({
                  firstName: user?.firstName || '',
                  lastName: user?.lastName || '',
                  email: user?.email || '',
                  phone: user?.phone || '',
                });
                setIsEditing(false);
              }}
            >
              Cancel
            </button>
            <button type="submit" className="btn-save">
              <i className="fas fa-save"></i> Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PersonalInfoTab;

