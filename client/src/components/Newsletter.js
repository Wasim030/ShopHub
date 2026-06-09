import React, { useState } from 'react';
import { newsletterAPI } from '../utils/api';
import toast from 'react-hot-toast';

const Newsletter = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await newsletterAPI.subscribe({ email });
      toast.success('Subscribed to newsletter!');
      setEmail('');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Subscription failed');
    }
  };

  return (
    <section className="bg-primary-600 py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Stay Updated</h2>
        <p className="text-primary-100 mb-6">Subscribe to our newsletter for exclusive deals and new arrivals.</p>
        <form onSubmit={handleSubmit} className="max-w-md mx-auto flex gap-2">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="flex-1 px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-white" required />
          <button type="submit" className="bg-white text-primary-600 px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors">Subscribe</button>
        </form>
      </div>
    </section>
  );
};

export default Newsletter;
