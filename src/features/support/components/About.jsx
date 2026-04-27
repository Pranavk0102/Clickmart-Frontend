import InfoPageLayout from './InfoPageLayout';

const About = () => {
  return (
    <InfoPageLayout
      title="About ClickMart"
      subtitle="India's fastest-growing online marketplace — delivering quality products at unbeatable prices right to your doorstep since 2021."
      icon="fas fa-store"
    >
      <div className="info-grid">
        <div className="info-card">
          <i className="fas fa-box-open"></i>
          <h3>2 Lakh+ Products</h3>
          <p>Curated selection across electronics, fashion, home, beauty and more.</p>
        </div>
        <div className="info-card">
          <i className="fas fa-truck"></i>
          <h3>Pan-India Delivery</h3>
          <p>Free delivery to 25,000+ pin codes across every state in India.</p>
        </div>
        <div className="info-card">
          <i className="fas fa-shield-alt"></i>
          <h3>Secure Payments</h3>
          <p>UPI, Cards, Net Banking and COD — all secured with 256-bit encryption.</p>
        </div>
        <div className="info-card">
          <i className="fas fa-undo"></i>
          <h3>Easy Returns</h3>
          <p>7-day hassle-free return policy on all eligible products.</p>
        </div>
      </div>

      <div className="info-section">
        <h2><i className="fas fa-flag"></i> Our Story</h2>
        <p>
          ClickMart was founded in 2021 in Chennai, Tamil Nadu with a simple mission: make quality products 
          accessible to every Indian household. Starting with just 500 products, we've grown to over 2 lakh 
          SKUs across 50+ categories, serving millions of happy customers every month.
        </p>
        <p style={{ marginTop: '12px' }}>
          We work directly with manufacturers and trusted brands to cut out the middleman — so you always 
          get the best price with guaranteed authenticity.
        </p>
      </div>

      <div className="info-section">
        <h2><i className="fas fa-bullseye"></i> Our Values</h2>
        <ul>
          <li><strong>Customer First</strong> — Every decision starts with "is this good for our customer?"</li>
          <li><strong>Transparent Pricing</strong> — What you see is what you pay. No hidden charges.</li>
          <li><strong>Speed & Reliability</strong> — Orders dispatched within 24 hours, delivered with care.</li>
          <li><strong>Local Love</strong> — We actively support Indian sellers and artisans.</li>
        </ul>
      </div>

      <div className="info-section">
        <h2><i className="fas fa-users"></i> Meet the Team</h2>
        <div className="team-grid">
          <div className="team-card">
            <div className="team-avatar">RK</div>
            <div className="team-name">Rajesh Kumar</div>
            <div className="team-role">CEO & Co-Founder</div>
          </div>
          <div className="team-card">
            <div className="team-avatar">PS</div>
            <div className="team-name">Priya Sundar</div>
            <div className="team-role">CTO</div>
          </div>
          <div className="team-card">
            <div className="team-avatar">AM</div>
            <div className="team-name">Arjun Menon</div>
            <div className="team-role">Head of Operations</div>
          </div>
          <div className="team-card">
            <div className="team-avatar">DV</div>
            <div className="team-name">Divya Varma</div>
            <div className="team-role">Head of Marketing</div>
          </div>
        </div>
      </div>
    </InfoPageLayout>
  );
};

export default About;
