import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Store, ShoppingBag, DollarSign, ArrowUpRight, TrendingUp, Tag, Star } from 'lucide-react';
import api from '../services/api';
import { PageLoader } from '../components/Loader';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/admin/stats');
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error('Failed to load admin stats:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Admin Control Center</h1>
          <p className="text-gray-500 text-sm mt-1">Platform overview, system metrics and operations management</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/admin/users"
            className="px-3.5 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/restaurants"
            className="px-3.5 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            Manage Restaurants
          </Link>
          <Link
            to="/admin/orders"
            className="px-3.5 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            Manage Orders
          </Link>
          <Link
            to="/admin/coupons"
            className="px-3.5 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl shadow-md shadow-orange-500/20 transition-all"
          >
            Manage Coupons
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Users</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalUsers || 0}</h3>
            <span className="text-xs text-green-600 font-medium flex items-center gap-1 mt-1">
              Active customers
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Restaurants</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalRestaurants || 0}</h3>
            <span className="text-xs text-orange-600 font-medium flex items-center gap-1 mt-1">
              Verified kitchens
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Store className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{stats?.totalOrders || 0}</h3>
            <span className="text-xs text-purple-600 font-medium flex items-center gap-1 mt-1">
              Processed deliveries
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Delivered Revenue</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">
              ₹{(stats?.totalRevenue || 0).toLocaleString()}
            </h3>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
              <TrendingUp className="w-3.5 h-3.5" /> Gross sales
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Recent Customer Orders</h2>
          <Link to="/admin/orders" className="text-xs font-semibold text-orange-600 hover:text-orange-700">
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                <th className="pb-3 font-semibold">Order ID</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Restaurant</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {stats?.recentOrders?.map((ord) => (
                <tr key={ord._id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 font-mono text-xs text-gray-500">
                    #{ord._id.substring(ord._id.length - 6).toUpperCase()}
                  </td>
                  <td className="py-3.5 font-medium text-gray-900">
                    {ord.user?.name || 'Customer'}
                  </td>
                  <td className="py-3.5 text-gray-600">
                    {ord.restaurant?.name || 'Restaurant'}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 capitalize">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 font-bold text-gray-900">
                    ₹{ord.totalAmount?.toFixed(2)}
                  </td>
                  <td className="py-3.5 text-xs text-gray-400">
                    {new Date(ord.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-400 text-sm">
                    No orders registered in the system yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
