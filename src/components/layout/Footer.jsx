import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <div className="footer-grid">
        <div>
          <div className="footer-logo">
            CLICK<span style={{ color: 'white' }}>MART</span>
          </div>
          <p className="footer-tagline">
            Your one-stop destination for all your shopping needs. Quality products at the best prices.
          </p>
          <div className="footer-contact">
            <p>
              <i className="fas fa-phone"></i> +91 98765 43210
            </p>
            <p>
              <i className="fas fa-envelope"></i> support@clickmart.com
            </p>
            <p>
              <i className="fas fa-map-marker-alt"></i> Chennai, India
            </p>
          </div>
        </div>

        <div>
          <div className="footer-heading">Quick Links</div>
          <ul className="footer-links">
            <li>
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <Link to="/faq">FAQ</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms">Terms & Conditions</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="footer-heading">Categories</div>
          <ul className="footer-links">
            <li>
              <Link to="/products?category=Electronics">Electronics</Link>
            </li>
            <li>
              <Link to="/products?category=Fashion">Fashion</Link>
            </li>
            <li>
              <Link to="/products?category=Home and Garden">Home and Garden</Link>
            </li>
            <li>
              <Link to="/products?category=Health and Beauty">Health and Beauty</Link>
            </li>
            <li>
              <Link to="/products?category=Sports">Sports</Link>
            </li>
            <li>
              <Link to="/products?category=Toys and Games">Toys and Games</Link>
            </li>
            <li>
              <Link to="/products?category=Automotive">Automotive Accessories</Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="footer-heading">Connect With Us</div>
          <div className="social-row">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              title="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              title="Twitter/X"
            >
              <i className="fab fa-twitter"></i>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              title="Facebook"
            >
              <i className="fab fa-facebook"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              title="YouTube"
            >
              <i className="fab fa-youtube"></i>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="social-btn"
              title="LinkedIn"
            >
              <i className="fab fa-linkedin"></i>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 ClickMart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
