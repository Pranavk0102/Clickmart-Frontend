import { useState } from 'react';
import './DeliverToModal.css';

const DeliverToModal = ({ isOpen, onClose, addresses = [], onSelectAddress, onAddNew }) => {
  const [pincode, setPincode] = useState('');
  const [pincodeResult, setPincodeResult] = useState(null);
  const [selectedAddr, setSelectedAddr] = useState(null);

  const checkPincode = () => {
    if (!pincode || pincode.length !== 6) {
      setPincodeResult({ available: false, message: 'Please enter a valid 6-digit PIN code' });
      return;
    }
    const available = parseInt(pincode) >= 400000 && parseInt(pincode) <= 799999;
    setPincodeResult({
      available,
      message: available
        ? `Delivery available to ${pincode}! Expected in 3-5 days.`
        : `Sorry, we don't deliver to ${pincode} yet.`
    });
  };

  const handleSelectAddress = (addr) => {
    setSelectedAddr(addr.id);
    onSelectAddress(addr);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-box deliver-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <i className="fas fa-map-marker-alt"></i> Deliver To
        </div>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="form-group">
          <label>Check Delivery Availability</label>
          <div className="pincode-checker">
            <input
              type="text"
              className="form-input"
              placeholder="Enter PIN code"
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value.replace(/\D/g, '').slice(0, 6));
                setPincodeResult(null);
              }}
              maxLength="6"
            />
            <button className="btn-check-pin" onClick={checkPincode}>
              <i className="fas fa-search"></i> Check
            </button>
          </div>
        </div>

        {pincodeResult && (
          <div className={`pincode-result ${pincodeResult.available ? 'available' : 'unavailable'}`}>
            <i className={`fas ${pincodeResult.available ? 'fa-check-circle' : 'fa-times-circle'}`}></i>
            {pincodeResult.message}
          </div>
        )}

        <div className="divider">OR</div>

        <div className="form-group">
          <label>Select Saved Address</label>
          {addresses.length > 0 ? (
            <div className="saved-addresses-list">
              {addresses.map(addr => (
                <div
                  key={addr.id}
                  className={`saved-addr-item ${selectedAddr === addr.id ? 'selected' : ''}`}
                  onClick={() => handleSelectAddress(addr)}
                >
                  <div className="saved-addr-name">
                    {addr.name} {addr.isDefault && <span className="addr-badge">DEFAULT</span>}
                  </div>
                  <div className="saved-addr-text">
                    {addr.addressLine1}, {addr.city}, {addr.state} - {addr.pinCode}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-addresses">
              <i className="fas fa-map-marker-alt"></i>
              <div>No saved addresses</div>
            </div>
          )}
        </div>

        <button className="btn-add-new-addr" onClick={onAddNew}>
          <i className="fas fa-plus"></i> Add New Address
        </button>
      </div>
    </div>
  );
};

export default DeliverToModal;
