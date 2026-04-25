import { Link } from 'react-router-dom';
import OrdersTab from './OrdersTab';

const Orders = () => {
  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/profile">Profile</Link>
        <span>/</span>
        <span>Orders</span>
      </div>

      <div style={{ marginTop: '20px' }}>
        <OrdersTab />
      </div>
    </div>
  );
};

export default Orders;
