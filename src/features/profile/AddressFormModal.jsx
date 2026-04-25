import { useState } from 'react';
import './AddressFormModal.css';

const createEmptyFormData = () => ({
  name: '',
  phone: '',
  addr1: '',
  addr2: '',
  city: '',
  state: '',
  pin: '',
  type: 'HOME',
  isDefault: false,
});

const getInitialFormData = (address) => ({
  ...createEmptyFormData(),
  ...(address || {}),
});

const AddressFormModal = ({ isOpen, onClose, onSubmit, address = null }) => {
  const [formData, setFormData] = useState(() => getInitialFormData(address));

  const [errors, setErrors] = useState({});

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.phone?.trim()) newErrors.phone = 'Phone is required';
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = 'Phone must be 10 digits';
    if (!formData.addr1?.trim()) newErrors.addr1 = 'Address is required';
    if (!formData.city?.trim()) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pin?.trim()) newErrors.pin = 'PIN code is required';
    else if (!/^\d{6}$/.test(formData.pin)) newErrors.pin = 'PIN code must be 6 digits';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-box addr-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <i className="fas fa-map-marker-alt"></i> {address ? 'Edit Address' : 'Add New Address'}
        </div>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Full Name <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <input
                type="text"
                name="name"
                className="form-input"
                value={formData.name || ''}
                onChange={handleChange}
                placeholder="Enter full name"
              />
              {errors.name && <div className="error-msg" style={{ display: 'block' }}>{errors.name}</div>}
            </div>
            <div className="form-group">
              <label>Phone Number <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <input
                type="text"
                name="phone"
                className="form-input"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="10-digit mobile"
                maxLength="10"
              />
              {errors.phone && <div className="error-msg" style={{ display: 'block' }}>{errors.phone}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>Address Line 1 <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
            <input
              type="text"
              name="addr1"
              className="form-input"
              value={formData.addr1 || ''}
              onChange={handleChange}
              placeholder="House No., Building Name"
            />
            {errors.addr1 && <div className="error-msg" style={{ display: 'block' }}>{errors.addr1}</div>}
          </div>

          <div className="form-group">
            <label>Address Line 2</label>
            <input
              type="text"
              name="addr2"
              className="form-input"
              value={formData.addr2 || ''}
              onChange={handleChange}
              placeholder="Road Name, Area, Colony (Optional)"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <input
                type="text"
                name="city"
                className="form-input"
                value={formData.city || ''}
                onChange={handleChange}
                placeholder="City"
              />
              {errors.city && <div className="error-msg" style={{ display: 'block' }}>{errors.city}</div>}
            </div>
            <div className="form-group">
              <label>PIN Code <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <input
                type="text"
                name="pin"
                className="form-input"
                value={formData.pin || ''}
                onChange={handleChange}
                placeholder="6-digit PIN"
                maxLength="6"
              />
              {errors.pin && <div className="error-msg" style={{ display: 'block' }}>{errors.pin}</div>}
            </div>
          </div>

          <div className="form-group">
            <label>State <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
            <select
              name="state"
              className="form-input"
              value={formData.state || ''}
              onChange={handleChange}
            >
              <option value="">-- Select State --</option>
              {indianStates.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
            {errors.state && <div className="error-msg" style={{ display: 'block' }}>{errors.state}</div>}
          </div>

          <div className="form-group">
            <label>Address Type <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
            <div className="addr-type-selector">
              <label className={`type-option ${formData.type === 'HOME' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="HOME"
                  checked={formData.type === 'HOME'}
                  onChange={handleChange}
                />
                <i className="fas fa-home"></i> Home
              </label>
              <label className={`type-option ${formData.type === 'OFFICE' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="OFFICE"
                  checked={formData.type === 'OFFICE'}
                  onChange={handleChange}
                />
                <i className="fas fa-briefcase"></i> Office
              </label>
              <label className={`type-option ${formData.type === 'OTHER' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="type"
                  value="OTHER"
                  checked={formData.type === 'OTHER'}
                  onChange={handleChange}
                />
                <i className="fas fa-map-marker-alt"></i> Other
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault || false}
                onChange={handleChange}
              />
              <span>Set as default address</span>
            </label>
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              <i className="fas fa-save"></i> {address ? 'Update Address' : 'Save Address'}
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressFormModal;

