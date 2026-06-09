import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiUser, FiMenu, FiX, FiHeart, FiSearch } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/products?search=${searchTerm.trim()}`);
      setSearchTerm('');
      setSearchOpen(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary-600">ShopHub</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-primary-600 font-medium">Products</Link>
            {user?.role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-primary-600 font-medium">Admin</Link>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={() => setSearchOpen(!searchOpen)} className="p-2 text-gray-600 hover:text-primary-600">
              <FiSearch size={20} />
            </button>

            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600">
              <FiShoppingCart size={20} />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center space-x-1 p-2 text-gray-600 hover:text-primary-600">
                  <FiUser size={20} />
                  <span className="hidden sm:block text-sm font-medium">{user.name}</span>
                </button>
                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>My Profile</Link>
                    <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>My Orders</Link>
                    <Link to="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setProfileOpen(false)}>Wishlist</Link>
                    <hr className="my-1" />
                    <button onClick={() => { logout(); setProfileOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn-primary text-sm py-2 px-4">Login</Link>
            )}

            <button className="md:hidden p-2 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {searchOpen && (
        <div className="bg-white border-t pb-4 px-4">
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto flex">
            <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products..." className="input-field rounded-r-none" autoFocus />
            <button type="submit" className="btn-primary rounded-l-none">Search</button>
          </form>
        </div>
      )}

      {menuOpen && (
        <div className="md:hidden bg-white border-t pb-4 px-4 space-y-2">
          <Link to="/" className="block py-2 text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/products" className="block py-2 text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>Products</Link>
          {user?.role === 'admin' && (
            <Link to="/admin" className="block py-2 text-gray-600 font-medium" onClick={() => setMenuOpen(false)}>Admin Panel</Link>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
