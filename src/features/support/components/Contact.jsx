import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import InfoPageLayout from './InfoPageLayout';
import { createTicket } from '../../profile/slices/ticketSlice';

const Contact = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Valid email required';
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message.trim()) newErrors.message = 'Message cannot be empty';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await dispatch(createTicket({
        customer: formData.name,
        email: formData.email,
        subject: formData.subject,
        category: 'other',
        priority: 'medium',
        message: formData.message,
        status: 'open'
      })).unwrap();

      toast.success("Message sent! We'll respond within 24 hours.");
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <InfoPageLayout
      title="Contact Us"
      subtitle="We're here to help! Reach out to us anytime and we'll get back to you within 24 hours."
      icon="fas fa-headset"
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
        <div className="info-section">
          <h2><i className="fas fa-map-marker-alt"></i> Get In Touch</h2>
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
            <i className="fas fa-phone" style={{ fontSize: '18px', color: '#ff8c00', marginTop: '2px', width: '20px' }}></i>
            <div>
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>Phone Support</h4>
              <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.6' }}>
                +91 98765 43210<br />
                +91 98765 43211<br />
                <span style={{ color: '#28a745', fontSize: '12px' }}>? Available 9AM � 9PM, Mon�Sat</span>
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
            <i className="fas fa-envelope" style={{ fontSize: '18px', color: '#ff8c00', marginTop: '2px', width: '20px' }}></i>
            <div>
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>Email Us</h4>
              <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.6' }}>
                support@clickmart.com<br />
                returns@clickmart.com
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
            <i className="fas fa-map-marker-alt" style={{ fontSize: '18px', color: '#ff8c00', marginTop: '2px', width: '20px' }}></i>
            <div>
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>Head Office</h4>
              <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.6' }}>
                ClickMart Pvt. Ltd.<br />
                42, Anna Salai, Teynampet<br />
                Chennai � 600018, Tamil Nadu
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
            <i className="fas fa-warehouse" style={{ fontSize: '18px', color: '#ff8c00', marginTop: '2px', width: '20px' }}></i>
            <div>
              <h4 style={{ color: '#fff', fontSize: '14px', marginBottom: '4px' }}>Fulfilment Centre</h4>
              <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.6' }}>
                Survey No. 14, SIDCO Industrial Estate<br />
                Ambattur, Chennai � 600098
              </p>
            </div>
          </div>

          <h2 style={{ marginTop: '24px' }}><i className="fas fa-clock"></i> Support Hours</h2>
          <div style={{ fontSize: '13px', color: '#aaa', padding: '6px 0', borderBottom: '1px solid #2a2a2a' }}>
            Monday � Friday <span style={{ color: '#ff8c00', fontWeight: '600', float: 'right' }}>9:00 AM � 9:00 PM</span>
          </div>
          <div style={{ fontSize: '13px', color: '#aaa', padding: '6px 0', borderBottom: '1px solid #2a2a2a' }}>
            Saturday <span style={{ color: '#ff8c00', fontWeight: '600', float: 'right' }}>10:00 AM � 6:00 PM</span>
          </div>
          <div style={{ fontSize: '13px', color: '#aaa', padding: '6px 0' }}>
            Sunday <span style={{ color: '#ff8c00', fontWeight: '600', float: 'right' }}>Closed</span>
          </div>
        </div>

        <div className="info-section">
          <h2><i className="fas fa-paper-plane"></i> Send a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Name <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <input
                className="form-input"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
              />
              {errors.name && <div className="error-msg">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label>Email Address <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <input
                className="form-input"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
              {errors.email && <div className="error-msg">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label>Mobile Number</label>
              <input
                className="form-input"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit mobile"
                maxLength="10"
              />
            </div>

            <div className="form-group">
              <label>Subject <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <select className="form-input" name="subject" value={formData.subject} onChange={handleChange}>
                <option value="">-- Select Subject --</option>
                <option>Order Issue</option>
                <option>Return / Refund</option>
                <option>Payment Problem</option>
                <option>Product Query</option>
                <option>Delivery Problem</option>
                <option>Account Issue</option>
                <option>Other</option>
              </select>
              {errors.subject && <div className="error-msg">{errors.subject}</div>}
            </div>

            <div className="form-group">
              <label>Message <span style={{ color: 'red', marginLeft: '2px' }}>*</span></label>
              <textarea
                className="form-input"
                name="message"
                rows="4"
                value={formData.message}
                onChange={handleChange}
                placeholder="Describe your issue in detail�"
                style={{ resize: 'vertical' }}
              />
              {errors.message && <div className="error-msg">{errors.message}</div>}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%' }}>
              <i className="fas fa-paper-plane"></i> Send Message
            </button>
          </form>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default Contact;

