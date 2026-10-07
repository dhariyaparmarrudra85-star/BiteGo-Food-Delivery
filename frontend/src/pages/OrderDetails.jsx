import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Package, Clock, MapPin, CreditCard, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import api from '../services/api';
import { PageLoader } from '../components/Loader';
import toast from 'react-hot-toast';

const ORDER_STEPS = [
  'Pending',
  'Confirmed',
  'Preparing',
  'Out for Delivery',
  'Delivered',
];

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.data.success) {
        setOrder(res.data.order);
      }
    } catch (err) {
      toast.error('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) return;
    setCancelling(true);
    try {
      const res = await api.put(`/orders/${id}/status`, { orderStatus: 'Cancelled' });
      if (res.data.success) {
        toast.success('Order cancelled successfully');
        fetchOrder();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!order?.restaurant?._id) return;

    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        restaurant: order.restaurant._id,
        rating: Number(rating),
        comment,
      });

      if (res.data.success) {
        toast.success('Thank you for your review!');
        setShowReviewModal(false);
        setComment('');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-gray-800">Order not found</h2>
        <Link to="/orders" className="text-orange-500 hover:underline mt-2 inline-block">
          Back to all orders
        </Link>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.findIndex(
    (s) => s.toLowerCase() === order.orderStatus?.toLowerCase()
  );
  const isCancelled = order.orderStatus?.toLowerCase() === 'cancelled';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link
        to="/orders"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-orange-600 mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Back to My Orders
      </Link>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-gray-900">
                Order #{order._id.substring(order._id.length - 8).toUpperCase()}
              </h1>
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${
                  isCancelled
                    ? 'bg-red-100 text-red-700'
                    : 'bg-orange-100 text-orange-700'
                }`}
              >
                {order.orderStatus}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-1">
              Placed on{' '}
              {new Date(order.createdAt).toLocaleDateString('en-US', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {order.orderStatus?.toLowerCase() === 'pending' && (
              <button
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="px-4 py-2 border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-xl transition-all disabled:opacity-50"
              >
                {cancelling ? 'Cancelling...' : 'Cancel Order'}
              </button>
            )}

            {order.orderStatus?.toLowerCase() === 'delivered' && (
              <button
                onClick={() => setShowReviewModal(true)}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-orange-500/20"
              >
                Write a Review
              </button>
            )}
          </div>
        </div>

        {/* Live Order Timeline */}
        {!isCancelled && (
          <div className="py-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-6">
              Delivery Progress
            </h2>
            <div className="relative flex justify-between items-center max-w-2xl mx-auto">
              <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
              <div
                className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 z-0 transition-all duration-500"
                style={{
                  width: `${
                    currentStepIndex >= 0
                      ? (currentStepIndex / (ORDER_STEPS.length - 1)) * 100
                      : 0
                  }%`,
                }}
              />

              {ORDER_STEPS.map((step, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div key={step} className="relative z-10 flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                        isCurrent
                          ? 'bg-orange-500 text-white ring-4 ring-orange-100 scale-110'
                          : isPassed
                          ? 'bg-orange-500 text-white'
                          : 'bg-white text-gray-400 border-2 border-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-medium mt-2 whitespace-nowrap ${
                        isCurrent
                          ? 'text-orange-600 font-bold'
                          : isPassed
                          ? 'text-gray-700'
                          : 'text-gray-400'
                      }`}
                    >
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
            <XCircle className="w-6 h-6 flex-shrink-0" />
            <div>
              <p className="font-semibold text-sm">Order Cancelled</p>
              <p className="text-xs text-red-600">This order was cancelled and will not be prepared or delivered.</p>
            </div>
          </div>
        )}

        {/* Order Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {/* Restaurant & Items */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Package className="w-4 h-4 text-orange-500" />
              Items from {order.restaurant?.name || 'Restaurant'}
            </h3>
            <div className="bg-gray-50 rounded-2xl p-4 divide-y divide-gray-200/60">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{item.food?.name || 'Food item'}</span>
                    <span className="text-gray-400 text-xs">× {item.quantity}</span>
                  </div>
                  <span className="font-medium text-gray-700">
                    ₹{((item.price || item.food?.price || 0) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}

              {/* Price Breakdown */}
              <div className="pt-3 space-y-1.5 text-xs text-gray-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{((order.totalAmount || 0) - (order.deliveryFee || 0) - (order.tax || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>₹{(order.deliveryFee || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax & Charges</span>
                  <span>₹{(order.tax || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span>₹{order.totalAmount?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Delivery & Payment Information */}
          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange-500" />
                Delivery Address
              </h3>
              <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-700 space-y-1">
                <p className="font-semibold">{order.deliveryAddress?.street}</p>
                <p className="text-gray-500 text-xs">
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                </p>
                {order.deliveryAddress?.phone && (
                  <p className="text-xs text-gray-400 pt-1">Phone: {order.deliveryAddress.phone}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-orange-500" />
                Payment Summary
              </h3>
              <div className="bg-gray-50 rounded-2xl p-4 text-sm text-gray-700 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-500">Method</span>
                  <span className="font-semibold capitalize">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <span className="font-semibold capitalize text-green-600">{order.paymentStatus}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-gray-900">
              Rate your experience with {order.restaurant?.name}
            </h3>
            <form onSubmit={handleAddReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Rating (1 to 5 Stars)
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                >
                  <option value="5">⭐⭐⭐⭐⭐ - Excellent (5/5)</option>
                  <option value="4">⭐⭐⭐⭐ - Good (4/5)</option>
                  <option value="3">⭐⭐⭐ - Average (3/5)</option>
                  <option value="2">⭐⭐ - Not Great (2/5)</option>
                  <option value="1">⭐ - Terrible (1/5)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                  Your Review
                </label>
                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tell us what you liked about the food and service..."
                  required
                  className="w-full px-4 py-2 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
