import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { orderAPI } from '../utils/api';
import Spinner from '../components/Spinner';
import { formatPrice, formatDate, statusColors } from '../utils/helpers';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data } = await orderAPI.getOne(id);
        setOrder(data.order);
      } catch {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Spinner className="py-20" />;
  if (!order) return <div className="text-center py-20"><p className="text-gray-500">Order not found</p></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/orders" className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 mb-6">
        <FiArrowLeft /><span>Back to Orders</span>
      </Link>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Order {order.orderId}</h1>
          <p className="text-gray-500">{formatDate(order.createdAt)}</p>
        </div>
        <span className={`px-4 py-2 rounded-full text-sm font-semibold ${statusColors[order.status]}`}>{order.status}</span>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <div className="card p-6">
            <h2 className="font-bold mb-4">Items</h2>
            <div className="space-y-4">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    <img src={item.image || 'https://via.placeholder.com/100'} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <Link to={`/products/${item.product}`} className="font-medium hover:text-primary-600">{item.name}</Link>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-bold">{formatPrice(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-bold mb-4">Order Summary</h2>
            <div className="space-y-2 text-sm">
              <p className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></p>
              <p className="flex justify-between"><span>Shipping</span><span>{formatPrice(order.shippingPrice)}</span></p>
              <p className="flex justify-between"><span>Tax</span><span>{formatPrice(order.taxPrice)}</span></p>
              <hr />
              <p className="flex justify-between font-bold text-lg"><span>Total</span><span>{formatPrice(order.totalPrice)}</span></p>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-bold mb-4">Shipping To</h2>
            <p className="text-sm text-gray-600">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}<br />
              {order.shippingAddress.country}
            </p>
          </div>

          <div className="card p-6">
            <h2 className="font-bold mb-4">Payment</h2>
            <p className="text-sm capitalize">{order.paymentMethod}</p>
            <p className="text-sm text-gray-500">{order.isPaid ? `Paid on ${formatDate(order.paidAt)}` : 'Not paid'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
