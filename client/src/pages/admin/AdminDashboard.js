import React, { useState, useEffect } from 'react';
import { FiPackage, FiDollarSign, FiUsers, FiShoppingBag, FiTrendingUp } from 'react-icons/fi';
import { orderAPI } from '../../utils/api';
import Spinner from '../../components/Spinner';
import { formatPrice } from '../../utils/helpers';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await orderAPI.getAnalytics();
        setAnalytics(data.analytics);
      } catch {
        setAnalytics(null);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Spinner className="py-20" />;

  const stats = [
    { label: 'Total Orders', value: analytics?.totalOrders || 0, icon: FiPackage, color: 'bg-blue-500' },
    { label: 'Total Revenue', value: formatPrice(analytics?.totalRevenue || 0), icon: FiDollarSign, color: 'bg-green-500' },
    { label: 'Top Product', value: analytics?.topProducts?.[0]?.name || 'N/A', icon: FiTrendingUp, color: 'bg-purple-500' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-white`}>
                <stat.icon size={24} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-bold mb-4">Orders by Status</h2>
          <div className="space-y-3">
            {analytics?.ordersByStatus?.map((item) => (
              <div key={item._id} className="flex items-center justify-between">
                <span className="capitalize text-gray-600">{item._id}</span>
                <span className="font-semibold">{item.count}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-lg font-bold mb-4">Top Products</h2>
          <div className="space-y-3">
            {analytics?.topProducts?.slice(0, 5).map((product, i) => (
              <div key={product._id} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-400">#{i + 1}</span>
                  <span className="text-sm">{product.name}</span>
                </div>
                <span className="text-sm font-semibold">{product.sold} sold</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-6 md:col-span-2">
          <h2 className="text-lg font-bold mb-4">Monthly Sales</h2>
          {analytics?.monthlySales?.length > 0 ? (
            <div className="grid grid-cols-6 md:grid-cols-12 gap-2">
              {analytics.monthlySales.map((month) => (
                <div key={month._id} className="text-center">
                  <div className="text-xs text-gray-500 mb-1">{month._id?.split('-')[1]}</div>
                  <div className="bg-primary-100 rounded" style={{ height: `${Math.min(100, (month.sales / (analytics.monthlySales[analytics.monthlySales.length - 1]?.sales || 1)) * 100)}px`, minHeight: '20px' }} />
                  <div className="text-xs font-medium mt-1">${month.sales.toFixed(0)}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No sales data yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
