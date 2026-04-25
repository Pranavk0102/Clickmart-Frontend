import { Link } from 'react-router-dom';
import './InfoPageLayout.css';

const InfoPageLayout = ({ title, subtitle, icon, children }) => {
  return (
    <div className="info-page">
      <div className="info-container">
        <Link to="/" className="back-btn">
          <i className="fas fa-arrow-left"></i> Back to Home
        </Link>
        
        <div className="info-hero">
          <h1>
            {icon && <i className={icon}></i>} {title}
          </h1>
          {subtitle && <p>{subtitle}</p>}
        </div>

        {children}
      </div>
    </div>
  );
};

export default InfoPageLayout;
