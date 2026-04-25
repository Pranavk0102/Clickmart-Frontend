import { useState } from 'react';
import InfoPageLayout from './InfoPageLayout';
import './FAQ.css';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqs = [
    { cat: 'Orders & Delivery', q: 'How do I place an order?', a: "Browse products, add them to your cart, proceed to checkout, enter your shipping address and complete payment. You'll receive an order confirmation on screen instantly." },
    { cat: 'Orders & Delivery', q: 'How long does delivery take?', a: 'Standard delivery takes 3-5 business days. Express delivery (₹99) takes 1-2 days. Same-day delivery (₹199) is available in select cities.' },
    { cat: 'Orders & Delivery', q: 'How can I track my order?', a: "Log in to your account, go to 'My Orders' in your profile page, and you'll see the real-time status of all your orders." },
    { cat: 'Orders & Delivery', q: 'Can I change my delivery address after placing an order?', a: 'Address changes can be made within 30 minutes of placing the order. Contact our support team immediately at +91 98765 43210.' },
    { cat: 'Orders & Delivery', q: 'Do you deliver across India?', a: 'Yes! We deliver to 25,000+ pin codes across all states and union territories in India. Enter your PIN code on the product page to check availability.' },
    { cat: 'Payments & Pricing', q: 'What payment methods do you accept?', a: 'We accept all major Credit/Debit cards (Visa, Mastercard, RuPay), UPI (GPay, PhonePe, Paytm), Net Banking (20+ banks), and Cash on Delivery (COD). A ₹29 COD handling fee applies.' },
    { cat: 'Payments & Pricing', q: 'Is it safe to pay on ClickMart?', a: 'Absolutely. All transactions are secured with 256-bit SSL encryption. We are PCI-DSS compliant and never store your card details on our servers.' },
    { cat: 'Payments & Pricing', q: 'How do coupon codes work?', a: "On the cart page, click 'Apply Coupon' and enter your code. Available codes: CLICKMART10 (10% off), NEWUSER (20% off for first order), SALE50 (₹500 off on orders above ₹5,000)." },
    { cat: 'Payments & Pricing', q: 'Why was my payment declined?', a: 'Payments can fail due to incorrect card details, bank restrictions on online transactions, or insufficient balance. Try a different payment method or contact your bank.' },
    { cat: 'Returns & Refunds', q: 'What is your return policy?', a: 'We offer a 7-day return window from the date of delivery for most products. Items must be unused, in original packaging, with all tags intact.' },
    { cat: 'Returns & Refunds', q: 'How do I initiate a return?', a: "Go to 'My Orders' in your profile, find the order, and click 'Return'. Our pickup partner will collect the item within 2-3 business days." },
    { cat: 'Returns & Refunds', q: 'When will I receive my refund?', a: 'Refunds are processed within 5-7 business days after we receive the returned item. UPI/bank refunds appear in 3-5 days; card refunds in 7-10 days.' },
    { cat: 'Returns & Refunds', q: 'Can I exchange a product instead of returning it?', a: "Yes, exchanges are available for size/colour issues on Fashion & Footwear items. Select 'Exchange' instead of 'Return' when raising the request." },
    { cat: 'Account & Profile', q: 'How do I create an account?', a: "Click 'Login / Signup' in the top-right corner, switch to the 'Sign Up' tab, and fill in your details. Your account is created instantly." },
    { cat: 'Account & Profile', q: 'I forgot my password. What should I do?', a: "On the login page, click 'Forgot Password'. Enter your registered email and you'll receive a reset link. You can also update your password in Profile > My Details." },
    { cat: 'Account & Profile', q: 'How do I save multiple delivery addresses?', a: "Go to Profile > Saved Addresses and click 'Add New Address'. You can save unlimited addresses and set one as default." },
    { cat: 'Account & Profile', q: 'How do I contact customer support?', a: 'Visit our Contact page, raise a support ticket in Profile > Support, or call us at +91 98765 43210 (Mon-Sat, 9AM-9PM).' },
  ];

  const filteredFAQs = searchQuery
    ? faqs.filter(f => 
        f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        f.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.cat]) acc[faq.cat] = [];
    acc[faq.cat].push(faq);
    return acc;
  }, {});

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <InfoPageLayout
      title="Frequently Asked Questions"
      subtitle="Find quick answers to the most common questions about ClickMart."
      icon="fas fa-question-circle"
    >
      <div className="faq-search-box">
        <input
          type="text"
          className="form-input"
          placeholder="Search your question…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {Object.keys(groupedFAQs).length > 0 ? (
        Object.keys(groupedFAQs).map((category) => (
          <div key={category}>
            <div className="faq-category">
              <i className="fas fa-chevron-right"></i> {category}
            </div>
            {groupedFAQs[category].map((faq, index) => {
              const globalIndex = `${category}-${index}`;
              return (
                <div
                  key={globalIndex}
                  className={`faq-item ${openFAQ === globalIndex ? 'open' : ''}`}
                >
                  <div className="faq-question" onClick={() => toggleFAQ(globalIndex)}>
                    {faq.q}
                    <i className="fas fa-chevron-down"></i>
                  </div>
                  <div className="faq-answer">{faq.a}</div>
                </div>
              );
            })}
          </div>
        ))
      ) : (
        <div className="no-results">
          <i className="fas fa-search"></i>
          No results found. Try a different keyword.
        </div>
      )}
    </InfoPageLayout>
  );
};

export default FAQ;
