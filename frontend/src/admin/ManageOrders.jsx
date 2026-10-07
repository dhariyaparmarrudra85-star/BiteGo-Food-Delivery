import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle, Search, Filter } from 'lucide-react';
import api from '../services/api';
import { PageLoader } from '../components/Loader';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      const url = filterStatus ? `/admin/orders?status=${filterStatus}` : '/admin/orders';
      const res = await api.get(url);
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        toast.success(`Order marked as ${newStatus}`);
        setOrders(orders.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o)));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Manage Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Live order dispatch, tracking and lifecycle management</p>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs font-medium text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Order ID</th>
                <th className="py-3.5 px-6 font-semibold">Customer</th>
                <th className="py-3.5 px-6 font-semibold">Restaurant</th>
                <th className="py-3.5 px-6 font-semibold">Total Amount</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Update Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((ord) => (
                <tr key={ord._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-mono text-xs font-semibold text-gray-800">
                    #{ord._id.substring(ord._id.length - 8).toUpperCase()}
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-semibold text-gray-900">{ord.user?.name || 'Customer'}</p>
                    <p className="text-xs text-gray-400">{ord.user?.phone || ord.user?.email}</p>
                  </td>
                  <td className="py-4 px-6 text-gray-700 font-medium text-xs">
                    {ord.restaurant?.name || 'Restaurant'}
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-900">
                    ₹{ord.totalAmount?.toFixed(2)}
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800 capitalize">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <select
                      value={ord.orderStatus}
                      onChange={(e) => handleStatusUpdate(ord._id, e.target.value)}
                      className="px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 focus:outline-none focus:ring-1 focus:ring-orange-500"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>{st}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 text-sm">
                    No orders matching selected criteria.
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

export default ManageOrders;
