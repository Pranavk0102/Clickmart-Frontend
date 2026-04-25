import './ConfirmModal.css';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Confirm', danger = false }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onCancel}>
      <div className="modal-box confirm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <i className={`fas ${danger ? 'fa-exclamation-triangle' : 'fa-question-circle'}`}
            style={{ color: danger ? '#dc3545' : '#ff8c00', marginRight: '8px' }}></i>
          {title}
        </div>
        <p style={{ color: '#aaa', fontSize: '14px', margin: '16px 0 24px', lineHeight: '1.6' }}>
          {message}
        </p>
        <div className="modal-actions">
          <button
            className="btn-primary"
            style={danger ? { background: '#dc3545', borderColor: '#dc3545' } : {}}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
