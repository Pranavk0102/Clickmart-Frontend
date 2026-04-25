import './OrderProgressTracker.css';

const OrderProgressTracker = ({ status }) => {
  const steps = [
    { id: 'placed', label: 'Order Placed', icon: '📝' },
    { id: 'confirmed', label: 'Confirmed', icon: '✅' },
    { id: 'shipped', label: 'Shipped', icon: '🚚' },
    { id: 'delivered', label: 'Delivered', icon: '📦' },
  ];

  const statusOrder = ['placed', 'confirmed', 'shipped', 'delivered'];
  const currentIndex = statusOrder.indexOf(status?.toLowerCase());

  return (
    <div className="order-progress-tracker">
      {steps.map((step, index) => {
        const isCompleted = index <= currentIndex;
        const isActive = index === currentIndex;

        return (
          <div key={step.id} className="progress-step-wrapper">
            <div className={`progress-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}>
              <div className="progress-dot">
                {isCompleted && (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
              <div className="progress-label">
                <span className="progress-icon">{step.icon}</span>
                <span className="progress-text">{step.label}</span>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className={`progress-line ${index < currentIndex ? 'completed' : ''}`} />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default OrderProgressTracker;
