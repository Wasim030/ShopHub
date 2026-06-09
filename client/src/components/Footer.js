import React from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">ShopHub</h3>
            <p className="text-sm">Your one-stop shop for quality products at great prices. Free shipping on orders over $100!</p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/" className="block hover:text-white">Home</Link>
              <Link to="/products" className="block hover:text-white">Products</Link>
              <Link to="/contact" className="block hover:text-white">Contact</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Categories</h4>
            <div className="space-y-2 text-sm">
              <Link to="/products?category=Electronics" className="block hover:text-white">Electronics</Link>
              <Link to="/products?category=Clothing" className="block hover:text-white">Clothing</Link>
              <Link to="/products?category=Home+%26+Garden" className="block hover:text-white">Home & Garden</Link>
              <Link to="/products?category=Books" className="block hover:text-white">Books</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-2 text-sm">
              <p className="flex items-center space-x-2"><FiMail /><span>support@shophub.com</span></p>
              <p className="flex items-center space-x-2"><FiPhone /><span>+1 (555) 123-4567</span></p>
              <p className="flex items-center space-x-2"><FiMapPin /><span>123 Commerce St, NY 10001</span></p>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
