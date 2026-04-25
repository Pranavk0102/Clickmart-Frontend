const StatusBadge = ({ status }) => {
  const badgeMap = {
    active: 'badge-green',
    blocked: 'badge-red',
    open: 'badge-orange',
    'in-progress': 'badge-blue',
    resolved: 'badge-green',
    pending: 'badge-orange',
    processing: 'badge-blue',
    delivered: 'badge-green',
    cancelled: 'badge-red',
    in_stock: 'badge-green',
    out_of_stock: 'badge-red',
    low_stock: 'badge-orange',
    high: 'badge-red',
    urgent: 'badge-red',
    medium: 'badge-orange',
    low: 'badge-grey',
    card: 'badge-grey',
    upi: 'badge-grey',
    cod: 'badge-grey',
    netbanking: 'badge-grey',
  };

  const badgeClass = badgeMap[status?.toLowerCase()] || 'badge-grey';
  const displayText = status?.replace(/_/g, ' ') || 'N/A';

  return <span className={`badge ${badgeClass}`}>{displayText}</span>;
};

export default StatusBadge;
