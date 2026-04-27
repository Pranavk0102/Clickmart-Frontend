import { useState } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import SideMenu from './components/layout/SideMenu';
import ErrorBoundary from './components/common/ErrorBoundary';
import BackToTop from './components/common/BackToTop';

import Home from './features/home/components/Home';
import Login from './features/auth/components/Login';
import ForgotPassword from './features/auth/components/ForgotPassword';
import ProtectedRoute from './features/auth/components/ProtectedRoute';
import AdminRoute from './features/auth/components/AdminRoute';

import Products from './features/products/components/Products';
import ProductDetail from './features/products/components/ProductDetail';

import Cart from './features/cart/components/Cart';
import Checkout from './features/checkout/components/Checkout';

import Orders from './features/orders/components/Orders';
import OrderDetail from './features/orders/components/OrderDetail';
import OrderSuccess from './features/orders/components/OrderSuccess';

import Profile from './features/profile/components/Profile';

import AdminLayout from './features/admin/components/AdminLayout';
import AdminDashboard from './features/admin/components/AdminDashboard';
import AdminOrders from './features/admin/components/AdminOrders';
import AdminCustomers from './features/admin/components/AdminCustomers';
import AdminInventory from './features/admin/components/AdminInventory';
import AdminProducts from './features/admin/components/AdminProducts';
import AdminCategories from './features/admin/components/AdminCategories';
import AdminCoupons from './features/admin/components/AdminCoupons';
import AdminTickets from './features/admin/components/AdminTickets';
import AdminOrderDetail from './features/admin/components/AdminOrderDetail';

import About from './features/support/components/About';
import Contact from './features/support/components/Contact';
import FAQ from './features/support/components/FAQ';
import Privacy from './features/support/components/Privacy';
import Terms from './features/support/components/Terms';

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
            <Route path="/forgot-password" element={<ForgotPassword />} />
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
