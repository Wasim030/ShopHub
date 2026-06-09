import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Spinner from './components/Spinner';

import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import Wishlist from './pages/Wishlist';
import Contact from './pages/Contact';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

import AdminLayout from './pages/admin/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner className="py-20" />;
  return user ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Spinner className="py-20" />;
  return user?.role === 'admin' ? children : <Navigate to="/admin/login" />;
};

const UserLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      <Route path="/" element={<UserLayout><Home /></UserLayout>} />
      <Route path="/products" element={<UserLayout><ProductList /></UserLayout>} />
      <Route path="/products/:id" element={<UserLayout><ProductDetail /></UserLayout>} />
      <Route path="/cart" element={<UserLayout><Cart /></UserLayout>} />
      <Route path="/checkout" element={<UserLayout><ProtectedRoute><Checkout /></ProtectedRoute></UserLayout>} />
      <Route path="/login" element={<UserLayout><Login /></UserLayout>} />
      <Route path="/register" element={<UserLayout><Register /></UserLayout>} />
      <Route path="/profile" element={<UserLayout><ProtectedRoute><Profile /></ProtectedRoute></UserLayout>} />
      <Route path="/orders" element={<UserLayout><ProtectedRoute><Orders /></ProtectedRoute></UserLayout>} />
      <Route path="/orders/:id" element={<UserLayout><ProtectedRoute><OrderDetail /></ProtectedRoute></UserLayout>} />
      <Route path="/wishlist" element={<UserLayout><ProtectedRoute><Wishlist /></ProtectedRoute></UserLayout>} />
      <Route path="/contact" element={<UserLayout><Contact /></UserLayout>} />
      <Route path="/forgot-password" element={<UserLayout><ForgotPassword /></UserLayout>} />
      <Route path="/reset-password/:token" element={<UserLayout><ResetPassword /></UserLayout>} />
    </Routes>
  );
}

export default App;
