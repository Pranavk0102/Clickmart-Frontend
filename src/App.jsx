import { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SideMenu from './components/layout/SideMenu';
import ErrorBoundary from './components/common/ErrorBoundary';
import BackToTop from './components/common/BackToTop';

import Home from './features/home/Home';
import Login from './features/auth/Login';
import ProtectedRoute from './features/auth/ProtectedRoute';
import AdminRoute from './features/auth/AdminRoute';

import Products from './features/products/Products';
import ProductDetail from './features/products/ProductDetail';

import Cart from './features/cart/Cart';
import Checkout from './features/checkout/Checkout';

import Orders from './features/orders/Orders';
import OrderDetail from './features/orders/OrderDetail';
import OrderSuccess from './features/orders/OrderSuccess';

import Profile from './features/profile/Profile';

import AdminLayout from './features/admin/AdminLayout';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminOrders from './features/admin/AdminOrders';
import AdminCustomers from './features/admin/AdminCustomers';
import AdminInventory from './features/admin/AdminInventory';
import AdminProducts from './features/admin/AdminProducts';
import AdminCategories from './features/admin/AdminCategories';
import AdminCoupons from './features/admin/AdminCoupons';
import AdminTickets from './features/admin/AdminTickets';
import AdminOrderDetail from './features/admin/AdminOrderDetail';

import About from './features/support/About';
import Contact from './features/support/Contact';
import FAQ from './features/support/FAQ';
import Privacy from './features/support/Privacy';
import Terms from './features/support/Terms';

const MainLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <Navbar onMenuToggle={() => setMenuOpen(!menuOpen)} />
      <SideMenu isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
      <Outlet />
      <Footer />
    </>
  );
};

function App() {
  return (
    <div className="App">
      <ErrorBoundary>
        <Routes>
          {/* Main Layout Routes (With Header and Footer) */}
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />

            {/* Protected Routes */}
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
            <Route path="/orders/:orderNumber" element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
            <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
            <Route path="/order-success/:orderNumber" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
          </Route>

          {/* Admin Routes (Uses its own AdminLayout) */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            <Route index element={<AdminDashboard />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="inventory" element={<AdminInventory />} />
            <Route path="tickets" element={<AdminTickets />} />
            <Route path="orders/:orderNumber" element={<AdminOrderDetail />} />
          </Route>

          {/* 404 Catch-all (No Header/Footer) */}
          <Route path="*" element={
            <div className="container" style={{ textAlign: 'center', padding: '80px 20px', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <i className="fas fa-exclamation-triangle" style={{ fontSize: '64px', color: '#ff8c00', marginBottom: '20px', display: 'block' }}></i>
              <h2 style={{ marginBottom: '10px', color: '#ff8c00' }}>Page Not Found</h2>
              <p style={{ color: '#888', marginBottom: '20px' }}>The page you are looking for does not exist.</p>
              <a href="/" className="btn-orange">Go to Home</a>
            </div>
          } />
        </Routes>
      </ErrorBoundary>
      <BackToTop />
    </div>
  );
}

export default App;
