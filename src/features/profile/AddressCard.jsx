import './AddressCard.css';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault, showActions = true }) => {
  const getTypeBadgeClass = (type) => {
    const classes = {
      HOME: 'addr-type-home',
      OFFICE: 'addr-type-office',
      OTHER: 'addr-type-other',
    };
    return classes[type?.toUpperCase()] || 'addr-type-other';
  };

  const getTypeIcon = (type) => {
    const icons = {
      HOME: 'fas fa-home',
      OFFICE: 'fas fa-briefcase',
      OTHER: 'fas fa-map-marker-alt',
    };
    return icons[type?.toUpperCase()] || 'fas fa-map-marker-alt';
  };

  return (
    <div className={`address-card ${address.isDefault ? 'default-addr' : ''}`}>
      {address.isDefault && <div className="addr-badge">DEFAULT</div>}
      
      <div className={`addr-type-badge ${getTypeBadgeClass(address.type)}`}>
        <i className={getTypeIcon(address.type)}></i> {address.type || 'Other'}
      </div>

      <div className="addr-name">{address.name}</div>
      
      <div className="addr-text">
        {address.addr1}
        {address.addr2 && <>, {address.addr2}</>}
        <br />
        {address.city}, {address.state} - {address.pin}
      </div>

      <div className="addr-phone">
        <i className="fas fa-phone"></i> {address.phone}
      </div>

      {showActions && (
        <div className="addr-actions">
          <button className="btn-small btn-edit-addr" onClick={() => onEdit(address)}>
            <i className="fas fa-edit"></i> Edit
          </button>
          <button className="btn-small btn-del-addr" onClick={() => onDelete(address.id)}>
            <i className="fas fa-trash"></i> Delete
          </button>
          {!address.isDefault && (
            <button className="btn-small btn-set-default" onClick={() => onSetDefault(address.id)}>
              <i className="fas fa-star"></i> Set Default
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default AddressCard;
