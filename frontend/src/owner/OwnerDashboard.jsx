import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Utensils, ShoppingBag, TrendingUp, Star, Clock, Plus, Settings } from 'lucide-react';
import api from '../services/api';
import { PageLoader } from '../components/Loader';

const OwnerDashboard = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOwnerData();
  }, []);

  const fetchOwnerData = async () => {
    try {
      const [rRes, oRes] = await Promise.all([
        api.get('/restaurants/owner/mine').catch(() => ({ data: { restaurant: null } })),
        api.get('/orders/restaurant').catch(() => ({ data: { orders: [] } })),
      ]);

      if (rRes.data?.restaurant) setRestaurant(rRes.data.restaurant);
      if (oRes.data?.orders) setOrders(oRes.data.orders);
    } catch (err) {
      console.error('Error fetching owner data:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  const totalRevenue = orders
    .filter((o) => o.orderStatus === 'delivered')
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  const pendingCount = orders.filter(
    (o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed' || o.orderStatus === 'preparing'
  ).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            {restaurant ? restaurant.name : 'Restaurant Partner Center'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {restaurant ? `Manage menu, orders and settings for ${restaurant.name}` : 'Welcome to your partner portal'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/owner/menu"
            className="flex items-center gap-1.5 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-xs shadow-md shadow-orange-500/20 transition-all"
          >
            <Utensils className="w-4 h-4" />
            Manage Menu
          </Link>
          <Link
            to="/owner/orders"
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl text-xs shadow-sm transition-all"
          >
            <ShoppingBag className="w-4 h-4" />
            Live Orders ({pendingCount})
          </Link>
          <Link
            to="/owner/settings"
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 font-semibold rounded-xl text-xs shadow-sm transition-all"
          >
            <Settings className="w-4 h-4" />
            Store Settings
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Orders</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{pendingCount}</h3>
            <span className="text-xs text-orange-600 font-medium">Needing kitchen attention</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-orange-50 text-orange-600 flex items-center justify-center">
            <Clock className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Orders</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">{orders.length}</h3>
            <span className="text-xs text-purple-600 font-medium">Lifetime volume</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShoppingBag className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Kitchen Earnings</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</h3>
            <span className="text-xs text-emerald-600 font-medium flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> Delivered payouts
            </span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Store className="w-7 h-7" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Rating</p>
            <h3 className="text-3xl font-black text-gray-900 mt-1 flex items-center gap-1">
              <Star className="w-6 h-6 fill-amber-400 text-amber-400 inline" />
              {restaurant?.rating?.toFixed(1) || '4.5'}
            </h3>
            <span className="text-xs text-amber-600 font-medium">{restaurant?.totalRatings || 24} customer reviews</span>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Star className="w-7 h-7" />
          </div>
        </div>
      </div>

      {/* Recent Kitchen Orders */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Incoming Kitchen Orders</h2>
          <Link to="/owner/orders" className="text-xs font-semibold text-orange-600 hover:text-orange-700">
            View Order Queue →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wider">
                <th className="pb-3 font-semibold">Order</th>
                <th className="pb-3 font-semibold">Customer</th>
                <th className="pb-3 font-semibold">Items</th>
                <th className="pb-3 font-semibold">Amount</th>
                <th className="pb-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-gray-700">
              {orders.slice(0, 5).map((ord) => (
                <tr key={ord._id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 font-mono text-xs text-gray-500">
                    #{ord._id.substring(ord._id.length - 6).toUpperCase()}
                  </td>
                  <td className="py-3.5 font-medium text-gray-900">
                    {ord.user?.name || 'Customer'}
                  </td>
                  <td className="py-3.5 text-xs text-gray-600 max-w-xs truncate">
                    {ord.items?.map((it) => `${it.food?.name || 'Item'} (${it.quantity})`).join(', ')}
                  </td>
                  <td className="py-3.5 font-bold text-gray-900">
                    ₹{ord.totalAmount?.toFixed(2)}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 capitalize">
                      {ord.orderStatus}
                    </span>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-400 text-sm">
                    No active orders received yet.
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

export default OwnerDashboard;
