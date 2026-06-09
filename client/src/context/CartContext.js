import React, { createContext, useState, useContext, useEffect } from 'react';
import { cartAPI } from '../utils/api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      const localCart = localStorage.getItem('guestCart');
      setCart(localCart ? JSON.parse(localCart) : { items: [] });
    }
  }, [user]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const { data } = await cartAPI.get();
      setCart(data.cart);
    } catch {
      setCart({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (user) {
      try {
        const { data } = await cartAPI.add({ productId: product._id, quantity });
        setCart(data.cart);
        toast.success('Added to cart');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to add');
      }
    } else {
      const newCart = { ...cart };
      const existing = newCart.items.find((item) => item.product === product._id);
      if (existing) {
        existing.quantity += quantity;
      } else {
        newCart.items.push({
          product: product._id,
          name: product.name,
          image: product.images[0]?.url || '',
          price: product.price,
          quantity,
        });
      }
      setCart(newCart);
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      toast.success('Added to cart');
    }
  };

  const updateQuantity = async (productId, quantity) => {
    if (user) {
      try {
        const { data } = await cartAPI.update({ productId, quantity });
        setCart(data.cart);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to update');
      }
    } else {
      const newCart = { ...cart };
      if (quantity <= 0) {
        newCart.items = newCart.items.filter((item) => item.product !== productId);
      } else {
        const item = newCart.items.find((item) => item.product === productId);
        if (item) item.quantity = quantity;
      }
      setCart(newCart);
      localStorage.setItem('guestCart', JSON.stringify(newCart));
    }
  };

  const removeFromCart = async (productId) => {
    if (user) {
      try {
        const { data } = await cartAPI.remove(productId);
        setCart(data.cart);
        toast.success('Removed from cart');
      } catch (err) {
        toast.error('Failed to remove');
      }
    } else {
      const newCart = { ...cart };
      newCart.items = newCart.items.filter((item) => item.product !== productId);
      setCart(newCart);
      localStorage.setItem('guestCart', JSON.stringify(newCart));
      toast.success('Removed from cart');
    }
  };

  const clearCart = async () => {
    if (user) {
      try {
        await cartAPI.clear();
      } catch {}
    }
    setCart({ items: [] });
    localStorage.removeItem('guestCart');
  };

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        totalItems,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
