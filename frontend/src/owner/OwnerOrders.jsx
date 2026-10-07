import { useState, useEffect } from 'react';
import { Package, Clock, CheckCircle2, AlertCircle, Phone, MapPin } from 'lucide-react';
import api from '../services/api';
import { PageLoader } from '../components/Loader';
import toast from 'react-hot-toast';

const STATUS_STEPS = ['Pending', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];

const OwnerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/restaurant');
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      toast.error('Failed to load restaurant orders');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { orderStatus: newStatus });
      if (res.data.success) {
        toast.success(`Order updated to: ${newStatus}`);
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
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Live Kitchen Orders</h1>
          <p className="text-gray-500 text-sm mt-1">
            Dispatch, track and update customer food preparations in real-time
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {orders.map((order) => {
          const isCancelled = order.orderStatus?.toLowerCase() === 'cancelled';
          const isDelivered = order.orderStatus?.toLowerCase() === 'delivered';

          return (
            <div
              key={order._id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="font-mono text-xs font-bold text-gray-500">
                    #{order._id.substring(order._id.length - 8).toUpperCase()}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-full capitalize ${
                      isDelivered
                        ? 'bg-green-100 text-green-700'
                        : isCancelled
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                </div>

                {/* Customer Details */}
                <div className="py-2 space-y-1 text-xs text-gray-600">
                  <p className="font-semibold text-gray-900 text-sm">{order.user?.name || 'Customer'}</p>
                  <p className="flex items-center gap-1 text-gray-500">
                    <Phone className="w-3.5 h-3.5 text-gray-400" />
                    {order.deliveryAddress?.phone || order.user?.phone || 'No phone'}
                  </p>
                  <p className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{order.deliveryAddress?.street}, {order.deliveryAddress?.city}</span>
                  </p>
                </div>

                {/* Items */}
                <div className="bg-gray-50 rounded-2xl p-3 my-2 space-y-1.5 text-xs">
                  {order.items?.map((it, idx) => (
                    <div key={idx} className="flex justify-between font-medium text-gray-700">
                      <span>{it.food?.name || 'Item'} × {it.quantity}</span>
                      <span>₹{((it.price || 0) * it.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-gray-900 text-sm">
                    <span>Total Bill</span>
                    <span>₹{order.totalAmount?.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Status Action */}
              <div className="pt-2">
                <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
                  Update Kitchen Status
                </label>
                <select
                  value={order.orderStatus}
                  onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                  disabled={isCancelled || isDelivered}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-800 focus:outline-none focus:ring-1 focus:ring-orange-500 disabled:opacity-50"
                >
                  {STATUS_STEPS.map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>
            </div>
          );
        })}

        {orders.length === 0 && (
          <div className="col-span-full py-16 text-center text-gray-400 text-sm bg-white rounded-3xl border border-gray-100">
            No orders have been placed for your restaurant yet.
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerOrders;
