import './TicketCard.css';

const normalizeTicketStatus = (status) => {
  if (!status) return 'OPEN';
  return String(status).toUpperCase().replace(/-/g, '_');
};

const normalizeTicketPriority = (priority) => {
  if (!priority) return 'MEDIUM';
  return String(priority).toUpperCase();
};

const TicketCard = ({ ticket, onView, isAdmin = false }) => {
  const getStatusColor = (status) => {
    const colors = {
      OPEN: '#ffc107',
      IN_PROGRESS: '#007bff',
      RESOLVED: '#28a745',
      CLOSED: '#6c757d',
    };
    return colors[status] || '#888';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      LOW: '#28a745',
      MEDIUM: '#ffc107',
      HIGH: '#ff8c00',
      URGENT: '#dc3545',
    };
    return colors[priority] || '#888';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const normalizedPriority = normalizeTicketPriority(ticket.priority);
  const normalizedStatus = normalizeTicketStatus(ticket.status);

  return (
    <div className="ticket-card" onClick={() => onView(ticket)}>
      <div className="ticket-header">
        <div className="ticket-id">#{ticket.displayId || ticket.id}</div>
        <div className="ticket-badges">
          <span 
            className="ticket-priority-badge"
            style={{ 
              background: `${getPriorityColor(normalizedPriority)}20`,
              color: getPriorityColor(normalizedPriority),
              border: `1px solid ${getPriorityColor(normalizedPriority)}`
            }}
          >
            {normalizedPriority}
          </span>
          <span 
            className="ticket-status-badge"
            style={{ 
              background: `${getStatusColor(normalizedStatus)}20`,
              color: getStatusColor(normalizedStatus),
              border: `1px solid ${getStatusColor(normalizedStatus)}`
            }}
          >
            {normalizedStatus.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="ticket-subject">{ticket.subject}</div>

      <div className="ticket-category">
        <i className="fas fa-tag"></i> {ticket.category}
      </div>

      {isAdmin && (ticket.customer || ticket.customerName) && (
        <div className="ticket-customer">
          <i className="fas fa-user"></i> {ticket.customer || ticket.customerName}
        </div>
      )}

      <div className="ticket-footer">
        <div className="ticket-date">
          <i className="fas fa-calendar"></i> {formatDate(ticket.createdAt || ticket.created)}
        </div>
        {ticket.lastResponse && (
          <div className="ticket-last-response">
            Last response: {formatDate(ticket.lastResponse)}
          </div>
        )}
      </div>

      {ticket.message && (
        <div className="ticket-preview">
          {ticket.message.substring(0, 100)}
          {ticket.message.length > 100 && '...'}
        </div>
      )}
    </div>
  );
};

export default TicketCard;
