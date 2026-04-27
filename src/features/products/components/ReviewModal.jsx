import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createReview } from '../slices/reviewSlice';
import { toast } from 'react-toastify';
import StarRatingInput from './StarRatingInput';
import './ReviewModal.css';

const ReviewModal = ({ isOpen, onClose, productId, orderId, productName }) => {
  const dispatch = useDispatch();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    setLoading(true);
    try {
      await dispatch(createReview({ productId, orderId, rating, comment })).unwrap();
      toast.success('Review submitted successfully!');
      onClose();
      setRating(0);
      setComment('');
    } catch (error) {
      toast.error(error || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay open" onClick={onClose}>
      <div className="review-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Write a Review</h2>
          <button className="close-button" onClick={onClose} aria-label="Close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <p className="product-name">{productName}</p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Your Rating</label>
              <StarRatingInput value={rating} onChange={setRating} size="large" />
            </div>

            <div className="form-group">
              <label htmlFor="review-comment">Your Review</label>
              <textarea
                id="review-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this product..."
                rows="5"
                required
              />
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewModal;
