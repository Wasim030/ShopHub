import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { authAPI } from '../utils/api';
import toast from 'react-hot-toast';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword({ email });
      setSent(true);
      toast.success('Reset email sent');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md card p-8">
        {sent ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-2">Check Your Email</h1>
            <p className="text-gray-500 mb-6">We've sent a password reset link to <strong>{email}</strong></p>
            <Link to="/login" className="text-primary-600 hover:underline">Back to Login</Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-center mb-2">Forgot Password?</h1>
            <p className="text-gray-500 text-center mb-8">Enter your email and we'll send you a reset link.</p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field pl-10" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send Reset Link'}</button>
            </form>
            <Link to="/login" className="flex items-center justify-center space-x-2 text-sm text-gray-500 mt-6 hover:text-primary-600">
              <FiArrowLeft /><span>Back to Login</span>
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
