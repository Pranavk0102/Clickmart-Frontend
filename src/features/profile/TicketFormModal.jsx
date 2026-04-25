import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createTicket } from './ticketSlice';
import { toast } from 'react-toastify';
import './TicketFormModal.css';

const TicketFormModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    subject: '',
    category: '',
    priority: 'medium',
    message: '',
  });

  const categories = [
    'Order Issue',
    'Payment Issue',
    'Product Quality',
    'Delivery Issue',
    'Return/Refund',
    'Account Issue',
    'Technical Issue',
    'Other',
  ];

  const priorities = ['low', 'medium', 'high', 'urgent'];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.subject.trim()) {
      toast.error('Please enter a subject');
      return;
    }

    if (!formData.category) {
      toast.error('Please select a category');
      return;
    }

    if (!formData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setLoading(true);
    try {
      await dispatch(createTicket(formData)).unwrap();
      toast.success('Ticket created successfully');
      setFormData({
        subject: '',
        category: '',
        priority: 'medium',
        message: '',
      });
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to create ticket');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="ticket-form-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <i className="fas fa-headset"></i> Create Support Ticket
          </h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="ticket-subject">Subject <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <input
                type="text"
                id="ticket-subject"
                className="form-input"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief description of your issue"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="ticket-category">Category <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                <select
                  id="ticket-category"
                  className="form-input"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  required
                >
                  <option value="">-- Select Category --</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="ticket-priority">Priority <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
                <select
                  id="ticket-priority"
                  className="form-input"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  required
                >
                  {priorities.map((priority) => (
                    <option key={priority} value={priority}>
                      {priority.toUpperCase()}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="ticket-message">Message <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <textarea
                id="ticket-message"
                className="form-input"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your issue in detail..."
                rows="6"
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Creating...' : 'Create Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TicketFormModal;

