import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChevronRight, Package, CheckCircle2, AlertCircle, ShoppingBag } from 'lucide-react';
import api from '../services/api';
import { PageLoader, EmptyState } from '../components/Loader';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  preparing: 'bg-purple-100 text-purple-800 border-purple-200',
  'out for delivery': 'bg-orange-100 text-orange-800 border-orange-200',
  delivered: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders');
      if (res.data.success) {
        setOrders(res.data.orders || []);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">My Orders</h1>
          <p className="text-gray-500 text-sm mt-1">Track and manage all your past and active food orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          message="Looks like you haven't ordered any delicious meals yet. Start exploring restaurants now!"
          buttonText="Explore Restaurants"
          buttonLink="/restaurants"
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusClass = statusColors[order.orderStatus?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all p-5 md:p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500">
                      <Package className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        {order.restaurant?.name || 'Restaurant'}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Order #{order._id.substring(order._id.length - 8).toUpperCase()} •{' '}
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full border capitalize ${statusClass}`}
                    >
                      {order.orderStatus}
                    </span>
                    <span className="text-lg font-extrabold text-gray-900">
                      ₹{order.totalAmount?.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="py-4">
                  <p className="text-sm text-gray-600 line-clamp-1">
                    {order.items?.map((item) => `${item.food?.name || 'Dish'} × ${item.quantity}`).join(', ')}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    Payment: <span className="font-medium capitalize text-gray-700">{order.paymentMethod}</span> ({order.paymentStatus})
                  </div>

                  <Link
                    to={`/orders/${order._id}`}
                    className="inline-flex items-center gap-1 px-4 py-2 bg-orange-50 hover:bg-orange-100 text-orange-600 font-semibold text-xs rounded-xl transition-colors"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
