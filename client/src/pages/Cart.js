import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, getShippingCost, getTaxAmount } from '../utils/helpers';

const Cart = () => {
  const { cart, updateQuantity, removeFromCart, subtotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const shipping = getShippingCost(subtotal);
  const tax = getTaxAmount(subtotal);
  const total = subtotal + shipping + tax;

  if (cart.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <FiShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
        <Link to="/products" className="btn-primary inline-flex items-center space-x-2"><FiArrowLeft /><span>Continue Shopping</span></Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart ({cart.items.length} items)</h1>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {cart.items.map((item) => (
            <div key={item.product} className="card p-4 flex gap-4">
              <Link to={`/products/${item.product}`} className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                <img src={item.image || 'https://via.placeholder.com/150'} alt={item.name} className="w-full h-full object-cover" />
              </Link>
              <div className="flex-1">
                <Link to={`/products/${item.product}`} className="font-semibold hover:text-primary-600">{item.name}</Link>
                <p className="text-primary-600 font-bold mt-1">{formatPrice(item.price)}</p>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center border rounded-lg">
                    <button onClick={() => updateQuantity(item.product, item.quantity - 1)} className="p-2 hover:bg-gray-50"><FiMinus size={14} /></button>
                    <span className="px-3 font-medium text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product, item.quantity + 1)} className="p-2 hover:bg-gray-50"><FiPlus size={14} /></button>
                  </div>
                  <button onClick={() => removeFromCart(item.product)} className="text-red-500 hover:text-red-600 p-2">
                    <FiTrash2 size={18} />
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-6 h-fit">
          <h3 className="text-lg font-bold mb-4">Order Summary</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? <span className="text-green-600">Free</span> : formatPrice(shipping)}</span></div>
            <div className="flex justify-between"><span>Tax (8%)</span><span>{formatPrice(tax)}</span></div>
            <hr />
            <div className="flex justify-between text-lg font-bold"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
          <button onClick={() => navigate(user ? '/checkout' : '/login?redirect=checkout')} className="btn-primary w-full mt-6">
            Proceed to Checkout
          </button>
          <Link to="/products" className="block text-center text-sm text-primary-600 hover:underline mt-4">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cart;
