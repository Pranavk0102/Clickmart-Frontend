import { Link } from 'react-router-dom';
import './HeroBanner.css';

const HeroBanner = ({ title, subtitle, ctaText, ctaLink, backgroundImage }) => {
  const style = backgroundImage ? { '--hero-bg-image': `url(${backgroundImage})` } : {};

  return (
    <div className="hero-banner" style={style}>
      <div className="hero-content">
        <h1 className="hero-title" dangerouslySetInnerHTML={{ __html: title }} />
        {subtitle && <p className="hero-subtitle">{subtitle}</p>}
        {ctaText && ctaLink && (
          <Link to={ctaLink} className="hero-cta">
            {ctaText} <i className="fas fa-arrow-right"></i>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HeroBanner;
