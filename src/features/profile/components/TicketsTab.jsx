import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTickets } from '../slices/ticketSlice';
import TicketCard from './TicketCard';
import TicketFormModal from './TicketFormModal';
import './TicketsTab.css';

const ticketStatuses = [
  { value: 'ALL', label: 'ALL' },
  { value: 'open', label: 'OPEN' },
  { value: 'in-progress', label: 'IN PROGRESS' },
  { value: 'resolved', label: 'RESOLVED' },
  { value: 'closed', label: 'CLOSED' },
];

const TicketsTab = () => {
  const dispatch = useDispatch();
  const { tickets, loading } = useSelector((state) => state.tickets);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [filter, setFilter] = useState('ALL');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    dispatch(fetchTickets());
  }, [dispatch]);

  const filteredTickets = filter === 'ALL'
    ? tickets
    : tickets.filter(ticket => ticket.status === filter);

  if (loading) {
    return <div className="loading">Loading tickets...</div>;
  }

  if (selectedTicket) {
    return (
      <div className="tickets-tab">
        <div className="section-head">
          <button className="btn-shop" onClick={() => setSelectedTicket(null)} style={{ marginRight: '12px' }}>
            <i className="fas fa-arrow-left"></i> Back
          </button>
          <div className="head-left">
            <i className="fas fa-ticket-alt"></i> Ticket #{selectedTicket.id}
          </div>
        </div>
        <div style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: '10px', padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ color: '#fff', margin: 0 }}>{selectedTicket.subject}</h3>
            <span className={`status-badge status-${selectedTicket.status}`}>{selectedTicket.status}</span>
          </div>
          <div style={{ color: '#888', fontSize: '13px', marginBottom: '16px' }}>
            Category: {selectedTicket.category} · Priority: {selectedTicket.priority}
          </div>
          <div style={{ background: '#252525', borderRadius: '8px', padding: '16px', marginBottom: '16px' }}>
            <div style={{ color: '#aaa', fontSize: '12px', marginBottom: '8px' }}>Your Message</div>
            <p style={{ color: '#ddd', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
              {selectedTicket.message || 'No message content.'}
            </p>
          </div>
          {selectedTicket.adminResponse && (
            <div style={{ background: 'rgba(255,140,0,0.08)', border: '1px solid rgba(255,140,0,0.3)', borderRadius: '8px', padding: '16px' }}>
              <div style={{ color: '#ff8c00', fontSize: '12px', marginBottom: '8px' }}>
                <i className="fas fa-reply"></i> Admin Response
                {selectedTicket.responseDate && <span style={{ color: '#666', marginLeft: '8px' }}>{selectedTicket.responseDate}</span>}
              </div>
              <p style={{ color: '#ddd', fontSize: '14px', lineHeight: '1.7', margin: 0 }}>
                {selectedTicket.adminResponse}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="tickets-tab">
      <div className="section-head">
        <div className="head-left">
          <i className="fas fa-headset"></i>
          Support Tickets
          {tickets.length > 0 && <span className="count-badge">{tickets.length}</span>}
        </div>
        <button className="btn-create-ticket" onClick={() => setCreateModalOpen(true)}>
          <i className="fas fa-plus"></i> Create Ticket
        </button>
      </div>

      <div className="ticket-filters">
        {ticketStatuses.map((status) => (
          <button
            key={status.value}
            className={`filter-btn ${filter === status.value ? 'active' : ''}`}
            onClick={() => setFilter(status.value)}
          >
            {status.label}
          </button>
        ))}
      </div>

      {filteredTickets.length === 0 ? (
        <div className="empty-state">
          <i className="fas fa-ticket-alt"></i>
          <p>No support tickets found</p>
          <button className="btn-shop" onClick={() => setCreateModalOpen(true)}>
            Create Your First Ticket
          </button>
        </div>
      ) : (
        <div className="tickets-list">
          {filteredTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onView={setSelectedTicket} />
          ))}
        </div>
      )}

      <TicketFormModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
};

export default TicketsTab;
