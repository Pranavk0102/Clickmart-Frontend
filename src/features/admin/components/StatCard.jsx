const StatCard = ({ icon, label, value, subtitle, color = '#ff8c00' }) => {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <i className={`fas ${icon}`}></i>
      </div>
      <div className="stat-info">
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className="stat-sub" style={{ color }}>{subtitle}</div>
      </div>
    </div>
  );
};

export default StatCard;
