import { useState } from 'react';
import './StarRatingInput.css';

const StarRatingInput = ({ value = 0, onChange, size = 'medium' }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const handleClick = (rating) => {
    onChange(rating);
  };

  return (
    <div className={`star-rating-input ${size}`}>
      {[5, 4, 3, 2, 1].map((star) => (
        <label key={star} className="star-label">
          <input
            type="radio"
            name="rating"
            value={star}
            checked={value === star}
            onChange={() => handleClick(star)}
            className="star-input"
          />
          <svg
            className={`star-icon ${(hoverValue || value) >= star ? 'filled' : ''}`}
            onMouseEnter={() => setHoverValue(star)}
            onMouseLeave={() => setHoverValue(0)}
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </label>
      ))}
    </div>
  );
};

export default StarRatingInput;
