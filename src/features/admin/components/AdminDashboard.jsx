import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { fetchDashboardStats, fetchAllOrders } from '../slices/adminSlice';
import StatCard from './StatCard';
import StatusBadge from './StatusBadge';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const adminState = useSelector((state) => state.admin);
  const dashboardStats = adminState.dashboardStats;
  const dashboardLoading = adminState.dashboardLoading;
  const orders = adminState.orders;
  const error = adminState.error;
  const [period, setPeriod] = useState('Last Week');
  
  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchAllOrders({ page: 0, size: 5 }));
  }, [dispatch]);

  // Mock chart data - replace with actual API data
  const chartData = {
    'Last Week': {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      sales: [18000, 21000, 19500, 25000, 22000, 28000, 30000],
      orders: [12, 18, 15, 22, 19, 25, 28]
    },
    'Last Month': {
      labels: ['W1', 'W2', 'W3', 'W4'],
      sales: [142000, 187000, 165000, 210000],
      orders: [110, 145, 128, 172]
    },
    'Last Year': {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      sales: [380000, 420000, 390000, 510000, 480000, 620000, 590000, 670000, 580000, 720000, 850000, 940000],
      orders: [290, 320, 300, 390, 370, 480, 450, 510, 440, 550, 660, 730]
    }
  };

  const currentData = chartData[period];

  const salesChartData = {
    labels: currentData.labels,
    datasets: [{
      label: 'Sales',
      data: currentData.sales,
      borderColor: '#ff8c00',
      backgroundColor: 'rgba(255,140,0,0.15)',
      fill: true,
      tension: 0.4,
      pointBackgroundColor: '#ff8c00'
    }]
  };

  const ordersChartData = {
    labels: currentData.labels,
    datasets: [{
      label: 'Orders',
      data: currentData.orders,
      borderColor: '#ff8c00',
      backgroundColor: 'transparent',
      tension: 0.4,
      pointBackgroundColor: '#ff8c00'
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#aaa',
          font: { family: 'Poppins' }
        }
      }
    },
    scales: {
      x: {
        ticks: { color: '#666' },
        grid: { color: '#2a2a2a' }
      },
      y: {
        ticks: { color: '#666' },
        grid: { color: '#2a2a2a' }
      }
    }
  };

  const formatPrice = (price) => {
    return `₹${parseFloat(price || 0).toLocaleString('en-IN')}`;
  };

  if (dashboardLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
        <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', marginBottom: '20px', display: 'block' }}></i>
        Loading dashboard...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '60px 20px' }}>
        <i className="fas fa-exclamation-triangle" style={{ fontSize: '64px', color: '#dc3545', marginBottom: '20px', display: 'block' }}></i>
        <h2 style={{ marginBottom: '10px', color: '#dc3545' }}>Dashboard Error</h2>
        <p style={{ color: '#888', marginBottom: '20px' }}>{error}</p>
        <button 
          className="btn-primary" 
          onClick={() => dispatch(fetchDashboardStats())}
        >
          Retry
        </button>
      </div>
    );
  }

  let totalRevenue = 0;
  if (dashboardStats && dashboardStats.totalRevenue) {
    totalRevenue = dashboardStats.totalRevenue;
  }

  let totalCustomers = 0;
  if (dashboardStats && dashboardStats.totalCustomers) {
    totalCustomers = dashboardStats.totalCustomers;
  }

  let totalOrders = 0;
  if (dashboardStats && dashboardStats.totalOrders) {
    totalOrders = dashboardStats.totalOrders;
  }

  let ordersTableBody = null;
  if (orders.length === 0) {
    ordersTableBody = (
      <tr>
        <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#555' }}>
          No orders yet
        </td>
      </tr>
    );
  } else {
    let recentOrders = [];
    for (let i = 0; i < orders.length; i++) {
      if (i < 5) {
        recentOrders.push(orders[i]);
      }
    }
    
    ordersTableBody = recentOrders.map((order) => {
      let customerName = 'Customer';
      if (order.customerName) {
        customerName = order.customerName;
      }

      let customerEmail = '';
      if (order.customerEmail) {
        customerEmail = order.customerEmail;
      }

      let itemsLength = 0;
      if (order.items && order.items.length) {
        itemsLength = order.items.length;
      }

      let dateString = '—';
      if (order.createdAt) {
        dateString = new Date(order.createdAt).toLocaleDateString('en-IN');
      }

      let paymentMethod = '';
      if (order.paymentMethod) {
        paymentMethod = order.paymentMethod.toLowerCase();
      }

      let orderStatus = '';
      if (order.status) {
        orderStatus = order.status.toLowerCase();
      }

      return (
        <tr key={order.orderNumber}>
          <td style={{ fontWeight: 600, color: '#ff8c00' }}>{order.orderNumber}</td>
          <td>
            <div className="td-bold">{customerName}</div>
            <div className="td-sub">{customerEmail}</div>
          </td>
          <td>{itemsLength}</td>
          <td style={{ color: '#ff8c00', fontWeight: 600 }}>{formatPrice(order.total)}</td>
          <td>{dateString}</td>
          <td><StatusBadge status={paymentMethod} /></td>
          <td><StatusBadge status={orderStatus} /></td>
        </tr>
      );
    });
  }

  return (
    <>
      <div className="page-heading">Dashboard</div>

      {/* Period Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
        {['Last Week', 'Last Month', 'Last Year'].map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            style={{
              background: period === p ? '#ff8c00' : '#252525',
              color: period === p ? '#111' : '#aaa',
              border: period === p ? 'none' : '1px solid #444',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '13px',
              fontWeight: period === p ? '600' : '400',
              transition: 'all 0.2s'
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="stat-cards">
        <StatCard
          icon="fa-rupee-sign"
          label="Total Revenue"
          value={formatPrice(totalRevenue)}
          subtitle="+12.5% from last period"
        />
        <StatCard
          icon="fa-users"
          label="Total Customers"
          value={totalCustomers}
          subtitle="+8.2% from last period"
        />
        <StatCard
          icon="fa-shopping-bag"
          label="Total Orders"
          value={totalOrders}
          subtitle="+5.1% from last period"
        />
        <StatCard
          icon="fa-chart-line"
          label="Conversion Rate"
          value="3.89%"
          subtitle="+0.4% from last period"
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-box">
          <h3>Sales Overview</h3>
          <div style={{ height: '280px' }}>
            <Line data={salesChartData} options={chartOptions} />
          </div>
        </div>
        <div className="chart-box">
          <h3>Orders Trend</h3>
          <div style={{ height: '280px' }}>
            <Line data={ordersChartData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="table-box">
        <div className="table-header">
          <h3>
            <i className="fas fa-receipt" style={{ color: '#ff8c00', marginRight: '8px' }}></i>
            Recent Orders
          </h3>
          <Link to="/admin/orders" className="btn-outline-sm">View All</Link>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr>
                <th>Order #</th>
                <th>Customer</th>
                <th>Items</th>
                <th>Total</th>
                <th>Date</th>
                <th>Payment</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ordersTableBody}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
