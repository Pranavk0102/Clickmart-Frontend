import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets, updateTicketStatus, respondToTicket } from '../profile/ticketSlice';
import RespondModal from '../profile/RespondModal';
import { toast } from 'react-toastify';
import './AdminTickets.css';

const toSearchableText = (value) => String(value || '').toLowerCase();

const formatTicketLabel = (value) =>
  String(value || '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

const formatTicketDate = (value) => {
  if (!value) return '-';

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('en-IN');
};

const AdminTickets = () => {
  const dispatch = useDispatch();
  const { tickets, loading } = useSelector((state) => state.tickets);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [showRespondModal, setShowRespondModal] = useState(false);
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);
  const getStatusBadgeClass = (status) => {
    const classes = {
      open: 'status-open',
      'in-progress': 'status-in-progress',
      resolved: 'status-resolved',
      closed: 'status-closed',
    };
    return classes[status] || 'status-open';
  };

  const getPriorityBadgeClass = (priority) => {
    const classes = {
      urgent: 'status-urgent',
      high: 'status-high',
      medium: 'status-medium',
      low: 'status-low',
    };
    return classes[priority] || 'status-medium';
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      !searchQuery ||
      toSearchableText(ticket.id).includes(searchQuery.toLowerCase()) ||
      toSearchableText(ticket.customer || ticket.customerName).includes(searchQuery.toLowerCase()) ||
      toSearchableText(ticket.subject).includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || ticket.status === statusFilter;
    const matchesPriority = !priorityFilter || ticket.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  const stats = {
    total: tickets.length,
    open: tickets.filter((ticket) => ticket.status === 'open').length,
    inProgress: tickets.filter((ticket) => ticket.status === 'in-progress').length,
    resolved: tickets.filter((ticket) => ticket.status === 'resolved').length,
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    if (!newStatus) return;

    try {
      await dispatch(updateTicketStatus({ ticketId, status: newStatus })).unwrap();
      toast.success(`Ticket ${ticketId} marked as ${formatTicketLabel(newStatus)}`);
    } catch {
      toast.error('Failed to update ticket status');
    }
  };

  const handleOpenRespondModal = (ticket) => {
    setSelectedTicket(ticket);
    setShowRespondModal(true);
  };

  const handleRespondSubmit = async ({ response, status }) => {
    try {
      await dispatch(
        respondToTicket({
          ticketId: selectedTicket.id,
          response,
          status,
        })
      ).unwrap();

      toast.success('Response sent to customer!');
      setShowRespondModal(false);
      setSelectedTicket(null);
    } catch {
      toast.error('Failed to send response');
    }
  };

  return (
    <div className="admin-tickets-page">
      <div className="page-heading">Support Tickets</div>

      <div className="stat-cards" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '24px' }}>
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-ticket-alt"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Total Tickets</div>
            <div className="stat-value">{stats.total}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(255,140,0,0.15)', color: '#ff8c00' }}>
            <i className="fas fa-envelope-open"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Open</div>
            <div className="stat-value" style={{ color: '#ff8c00' }}>
              {stats.open}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(0,123,255,0.15)', color: '#007bff' }}>
            <i className="fas fa-spinner"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">In Progress</div>
            <div className="stat-value" style={{ color: '#007bff' }}>
              {stats.inProgress}
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(40,167,69,0.15)', color: '#28a745' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-info">
            <div className="stat-label">Resolved</div>
            <div className="stat-value" style={{ color: '#28a745' }}>
              {stats.resolved}
            </div>
          </div>
        </div>
      </div>

      <div className="table-box">
        <div className="table-header">
          <input
            className="search-input"
            placeholder="Search by ticket #, name or subject..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select
            className="filter-select"
            value={priorityFilter}
            onChange={(e) => {
              setPriorityFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Ticket #</th>
                <th>Customer</th>
                <th>Subject</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px' }}>
                    <i className="fas fa-spinner fa-spin" style={{ fontSize: '24px', color: '#666' }}></i>
                  </td>
                </tr>
              ) : paginatedTickets.length > 0 ? (
                paginatedTickets.map((ticket) => (
                  <tr key={ticket.id}>
                    <td style={{ color: '#ff8c00', fontWeight: '600', fontSize: '12px' }}>
                      {ticket.displayId || ticket.id}
                      {ticket.adminResponse && (
                        <i className="fas fa-check-circle" style={{ color: '#28a745', marginLeft: '4px' }} title="Response sent"></i>
                      )}
                    </td>
                    <td>
                      <div className="td-bold">{ticket.customer || '-'}</div>
                      <div className="td-sub">{ticket.email || ''}</div>
                    </td>
                    <td style={{ maxWidth: '200px', color: '#ddd' }}>{ticket.subject || ''}</td>
                    <td>
                      <span className="status-badge">
                        {formatTicketLabel(ticket.category || 'other')}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getPriorityBadgeClass(ticket.priority || 'medium')}`}>
                        {formatTicketLabel(ticket.priority || 'medium')}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(ticket.status || 'open')}`}>
                        {formatTicketLabel(ticket.status || 'open')}
                      </span>
                    </td>
                    <td style={{ color: '#888' }}>{formatTicketDate(ticket.createdAt || ticket.created)}</td>
                    <td style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <button
                        className="btn-icon"
                        onClick={() => handleOpenRespondModal(ticket)}
                        title="Respond"
                        style={{ color: '#007bff' }}
                      >
                        <i className="fas fa-reply"></i>
                      </button>
                      <select
                        onChange={(e) => handleStatusChange(ticket.id, e.target.value)}
                        value=""
                        style={{
                          background: '#333',
                          border: '1px solid #444',
                          color: '#aaa',
                          padding: '4px 6px',
                          borderRadius: '4px',
                          fontFamily: 'Poppins, sans-serif',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        <option value="">Change</option>
                        <option value="open">Open</option>
                        <option value="in-progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
                    <i className="fas fa-ticket-alt" style={{ fontSize: '32px', display: 'block', marginBottom: '10px' }}></i>
                    No tickets found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="admin-pagination">
            <button
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
              disabled={currentPage === totalPages}
              className="pagination-btn"
            >
              Next
            </button>
          </div>
        )}
      </div>

      <RespondModal
        key={selectedTicket?.id || 'respond-modal'}
        isOpen={showRespondModal}
        onClose={() => {
          setShowRespondModal(false);
          setSelectedTicket(null);
        }}
        ticket={selectedTicket}
        onSubmit={handleRespondSubmit}
        isAdmin={true}
      />
    </div>
  );
};

export default AdminTickets;
