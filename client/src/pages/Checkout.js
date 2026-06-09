import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiTruck, FiCreditCard, FiCheck } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { orderAPI } from '../utils/api';
import { formatPrice, getShippingCost, getTaxAmount } from '../utils/helpers';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, subtotal, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '', city: '', state: '', zipCode: '', country: 'USA',
  });
  const [paymentMethod, setPaymentMethod] = useState('stripe');

  const shipping = getShippingCost(subtotal);
  const tax = getTaxAmount(subtotal);
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const { data } = await orderAPI.create({
        shippingAddress: address,
        paymentMethod,
        items: cart.items.map((item) => ({
          product: item.product,
          quantity: item.quantity,
        })),
      });
      toast.success('Order placed successfully!');
      clearCart();
      navigate(`/orders/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>

      <div className="flex items-center justify-center mb-8">
        {[
          { num: 1, label: 'Shipping', icon: FiTruck },
          { num: 2, label: 'Payment', icon: FiCreditCard },
          { num: 3, label: 'Review', icon: FiCheck },
        ].map((s) => (
          <div key={s.num} className="flex items-center">
            <div className={`flex items-center space-x-2 ${step >= s.num ? 'text-primary-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${step >= s.num ? 'bg-primary-600 text-white' : 'bg-gray-200'}`}>{s.num}</div>
              <span className="text-sm font-medium hidden sm:block">{s.label}</span>
            </div>
            {s.num < 3 && <div className={`w-12 md:w-20 h-0.5 mx-2 ${step > s.num ? 'bg-primary-600' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Street Address</label>
                  <input type="text" value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">City</label>
                  <input type="text" value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State</label>
                  <input type="text" value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">ZIP Code</label>
                  <input type="text" value={address.zipCode} onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Country</label>
                  <input type="text" value={address.country} onChange={(e) => setAddress({ ...address, country: e.target.value })} className="input-field" required />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="btn-primary mt-6" disabled={!address.street || !address.city || !address.state || !address.zipCode}>
                Continue to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              <div className="space-y-3">
                {[
                  { value: 'stripe', label: 'Credit/Debit Card (Stripe)' },
                  { value: 'cod', label: 'Cash on Delivery' },
                ].map((method) => (
                  <label key={method.value} className={`flex items-center p-4 border rounded-lg cursor-pointer ${paymentMethod === method.value ? 'border-primary-600 bg-primary-50' : 'hover:bg-gray-50'}`}>
                    <input type="radio" name="payment" value={method.value} checked={paymentMethod === method.value} onChange={(e) => setPaymentMethod(e.target.value)} className="mr-3" />
                    <span className="font-medium">{method.label}</span>
                  </label>
                ))}
              </div>
              <div className="flex space-x-4 mt-6">
                <button onClick={() => setStep(1)} className="btn-outline">Back</button>
                <button onClick={() => setStep(3)} className="btn-primary">Continue to Review</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card p-6">
              <h2 className="text-lg font-bold mb-4">Order Review</h2>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Shipping To:</h3>
                <p className="text-sm text-gray-600">{address.street}, {address.city}, {address.state} {address.zipCode}, {address.country}</p>
              </div>
              <div className="mb-6">
                <h3 className="font-semibold mb-2">Payment Method:</h3>
                <p className="text-sm text-gray-600">{paymentMethod === 'stripe' ? 'Credit/Debit Card' : 'Cash on Delivery'}</p>
              </div>
              <div className="space-y-2">
                {cart.items.map((item) => (
                  <div key={item.product} className="flex items-center justify-between text-sm">
                    <span>{item.name} x {item.quantity}</span>
                    <span>{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
              <div className="flex space-x-4 mt-6">
                <button onClick={() => setStep(2)} className="btn-outline">Back</button>
                <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1">
                  {loading ? 'Processing...' : `Place Order - ${formatPrice(total)}`}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="card p-6 h-fit">
          <h3 className="font-bold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            <p className="flex justify-between"><span>Items ({cart.items.length})</span><span>{formatPrice(subtotal)}</span></p>
            <p className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span></p>
            <p className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></p>
            <hr />
            <p className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatPrice(total)}</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
