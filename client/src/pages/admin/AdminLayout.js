import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiPackage, FiShoppingCart, FiUsers, FiLogOut, FiMenu, FiX, FiHome } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
    { path: '/admin/products', label: 'Products', icon: FiPackage },
    { path: '/admin/orders', label: 'Orders', icon: FiShoppingCart },
    { path: '/admin/users', label: 'Users', icon: FiUsers },
  ];

  const isActive = (item) => {
    if (item.exact) return location.pathname === item.path;
    return location.pathname.startsWith(item.path);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <Link to="/admin" className="text-xl font-bold">Admin Panel</Link>
            <button className="lg:hidden" onClick={() => setSidebarOpen(false)}><FiX size={20} /></button>
          </div>
        </div>
        <nav className="px-4 space-y-1">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path} onClick={() => setSidebarOpen(false)} className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${isActive(item) ? 'bg-primary-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
          <Link to="/" className="flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors">
            <FiHome size={20} /><span>Back to Store</span>
          </Link>
        </nav>
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-gray-400 text-xs">{user?.email}</p>
            </div>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-white"><FiLogOut size={18} /></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">
        <div className="lg:hidden bg-white shadow-sm p-4 flex items-center">
          <button onClick={() => setSidebarOpen(true)} className="p-2"><FiMenu size={24} /></button>
          <span className="ml-2 font-bold">Admin Panel</span>
        </div>
        <div className="p-6">
          <Outlet />
        </div>
      </main>

      {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default AdminLayout;
