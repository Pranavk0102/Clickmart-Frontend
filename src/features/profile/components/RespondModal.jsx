import { useState } from 'react';
import './RespondModal.css';

const getInitialStatus = (ticket) => {
  if (!ticket?.status) {
    return 'in-progress';
  }

  return ticket.status === 'open' ? 'in-progress' : ticket.status;
};

const RespondModal = ({ isOpen, onClose, ticket, onSubmit, isAdmin = false }) => {
  const [response, setResponse] = useState(() => ticket?.adminResponse || '');
  const [status, setStatus] = useState(() => getInitialStatus(ticket));
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!response.trim()) {
      setError('Please type a response message.');
      return;
    }
    onSubmit({ response: response.trim(), status });
    setResponse('');
    setError('');
  };

  if (!isOpen || !ticket) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="modal-box respond-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-title">
          <i className="fas fa-reply"></i> Respond to Ticket
        </div>
        <button className="modal-close" onClick={onClose}>
          <i className="fas fa-times"></i>
        </button>

        <div className="ticket-info-box">
          <div className="ticket-info-header">
            <span className="ticket-id">{ticket.id}</span>
            {' · '}
            <span className={`status-badge status-${ticket.priority || 'medium'}`}>
              {ticket.priority || 'medium'}
            </span>
            {' · '}
            <span className={`status-badge status-${ticket.status || 'open'}`}>
              {ticket.status || 'open'}
            </span>
          </div>
          <div className="ticket-subject">{ticket.subject || 'No Subject'}</div>
          <div className="ticket-from">
            From: {ticket.customer || 'Customer'} ({ticket.email || ''})
          </div>
          {ticket.message && (
            <div className="ticket-message">"{ticket.message}"</div>
          )}
          {ticket.adminResponse && (
            <div className="previous-response">
              <i className="fas fa-check-circle"></i>
              Previously responded on {ticket.responseDate || ''}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Your Response <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
            <textarea
              className="form-input"
              rows="5"
              value={response}
              onChange={(e) => {
                setResponse(e.target.value);
                setError('');
              }}
              placeholder="Type your response to the customer…"
              style={{ resize: 'vertical' }}
            />
            {error && <div className="error-msg">{error}</div>}
          </div>

          {isAdmin && (
            <div className="form-group">
              <label>Update Ticket Status</label>
              <select
                className="form-input"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="in-progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="open">Open</option>
              </select>
            </div>
          )}

          <div className="modal-actions">
            <button type="submit" className="btn-primary">
              <i className="fas fa-paper-plane"></i> Send Response
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

export default RespondModal;

