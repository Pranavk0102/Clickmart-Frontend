import InfoPageLayout from './InfoPageLayout';

const Privacy = () => {
  return (
    <InfoPageLayout
      title="Privacy Policy"
      subtitle="Last updated: 1st January 2024 · Effective immediately"
      icon="fas fa-shield-alt"
    >
      <div className="info-section">
        <h2>1. Information We Collect</h2>
        <p>When you use ClickMart, we collect:</p>
        <ul>
          <li>Personal details (name, email, phone, delivery address)</li>
          <li>Payment information (processed securely — we never store card numbers)</li>
          <li>Order history and browsing behaviour on our platform</li>
          <li>Device information and IP address for security purposes</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>2. How We Use Your Information</h2>
        <ul>
          <li>To process and deliver your orders</li>
          <li>To send order updates, delivery notifications and receipts</li>
          <li>To personalise your shopping experience and product recommendations</li>
          <li>To detect and prevent fraud and unauthorised access</li>
          <li>To improve our platform based on usage analytics</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>3. Data Sharing</h2>
        <p>We do not sell your personal data. We share information only with:</p>
        <ul>
          <li>Delivery partners (name, address, phone for order fulfilment)</li>
          <li>Payment gateways (for secure transaction processing)</li>
          <li>Law enforcement when legally required</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>4. Data Security</h2>
        <p>
          All data is protected with 256-bit SSL/TLS encryption. Our servers are ISO 27001 certified. 
          Payment data is PCI-DSS compliant. We conduct regular security audits.
        </p>
      </div>

      <div className="info-section">
        <h2>5. Your Rights</h2>
        <p>Under India's Digital Personal Data Protection Act 2023, you have the right to:</p>
        <ul>
          <li>Access the personal data we hold about you</li>
          <li>Correct inaccurate information</li>
          <li>Delete your account and associated data</li>
          <li>Withdraw consent at any time</li>
        </ul>
        <p style={{ marginTop: '10px' }}>
          To exercise these rights, email us at <span style={{ color: '#ff8c00' }}>privacy@clickmart.com</span>
        </p>
      </div>

      <div className="info-section">
        <h2>6. Cookies</h2>
        <p>
          We use essential cookies to keep you logged in and remember your cart. We use analytics cookies 
          (with your consent) to understand how customers use our site. You can manage cookie preferences 
          in your browser settings.
        </p>
      </div>

      <div className="info-section">
        <h2>7. Contact</h2>
        <p>
          For privacy concerns: <span style={{ color: '#ff8c00' }}>privacy@clickmart.com</span><br />
          ClickMart Pvt. Ltd., 42 Anna Salai, Chennai – 600018
        </p>
      </div>
    </InfoPageLayout>
  );
};

export default Privacy;
