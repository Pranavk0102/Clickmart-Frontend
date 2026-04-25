import './CheckoutStepIndicator.css';

const CheckoutStepIndicator = ({ currentStep }) => {
  const steps = [
    { id: 1, label: 'Cart', icon: '🛒' },
    { id: 2, label: 'Shipping', icon: '📦' },
    { id: 3, label: 'Payment', icon: '💳' },
  ];

  return (
    <div className="checkout-step-indicator">
      {steps.map((step, index) => (
        <div key={step.id} className="step-wrapper">
          <div className={`step ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
            <div className="step-circle">
              {currentStep > step.id ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <span className="step-icon">{step.icon}</span>
              )}
            </div>
            <span className="step-label">{step.label}</span>
          </div>
          {index < steps.length - 1 && (
            <div className={`step-line ${currentStep > step.id ? 'completed' : ''}`} />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutStepIndicator;
