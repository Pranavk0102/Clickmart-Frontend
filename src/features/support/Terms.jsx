import InfoPageLayout from './InfoPageLayout';

const Terms = () => {
  return (
    <InfoPageLayout
      title="Terms & Conditions"
      subtitle="Last updated: 1st January 2024 · Please read carefully before using ClickMart."
      icon="fas fa-file-contract"
    >
      <div className="info-section">
        <h2>1. Acceptance of Terms</h2>
        <p>
          By accessing or using ClickMart (clickmart.com), you agree to be bound by these Terms & Conditions 
          and our Privacy Policy. If you do not agree, please do not use our platform.
        </p>
      </div>

      <div className="info-section">
        <h2>2. Account Responsibility</h2>
        <ul>
          <li>You must be at least 18 years old to create an account</li>
          <li>You are responsible for maintaining the security of your password</li>
          <li>You must provide accurate and up-to-date information</li>
          <li>One person may not maintain more than one active account</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>3. Orders & Pricing</h2>
        <ul>
          <li>All prices are in Indian Rupees (₹) and inclusive of applicable GST</li>
          <li>ClickMart reserves the right to cancel orders with pricing errors</li>
          <li>We reserve the right to limit quantities per customer</li>
          <li>Order confirmation does not guarantee product availability</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>4. Returns & Refunds</h2>
        <p>
          Products are eligible for return within 7 days of delivery, subject to our Return Policy. 
          Certain categories (personal care, digital goods, customised items) are not returnable. 
          Refunds are processed within 7-10 business days.
        </p>
      </div>

      <div className="info-section">
        <h2>5. Prohibited Conduct</h2>
        <ul>
          <li>Reselling products purchased at promotional prices</li>
          <li>Using the platform for fraudulent transactions</li>
          <li>Attempting to bypass security measures or access systems unauthorised</li>
          <li>Posting fake or misleading reviews</li>
        </ul>
      </div>

      <div className="info-section">
        <h2>6. Intellectual Property</h2>
        <p>
          All content on ClickMart — including logos, product images, text and software — is owned by 
          ClickMart Pvt. Ltd. and protected under Indian copyright law. Unauthorised reproduction is prohibited.
        </p>
      </div>

      <div className="info-section">
        <h2>7. Governing Law</h2>
        <p>
          These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction 
          of courts in Chennai, Tamil Nadu.
        </p>
      </div>

      <div className="info-section">
        <h2>8. Contact</h2>
        <p>
          Legal queries: <span style={{ color: '#ff8c00' }}>legal@clickmart.com</span><br />
          ClickMart Pvt. Ltd., 42 Anna Salai, Chennai – 600018
        </p>
      </div>
    </InfoPageLayout>
  );
};

export default Terms;
