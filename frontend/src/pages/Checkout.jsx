import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, CreditCard, Banknote, CheckCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, subtotal, deliveryFee, tax, discount, total, fetchCart } = useCart();

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading] = useState(false);

  const handleAddressChange = (e) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    const required = ['fullName', 'phone', 'addressLine', 'city', 'state', 'pincode'];
    const missing = required.filter(f => !address[f].trim());
    if (missing.length > 0) {
      toast.error('Please fill in all address fields.');
      return;
    }
    try {
      setLoading(true);
      const res = await api.post('/orders', {
        deliveryAddress: address,
        paymentMethod,
      });
      await fetchCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${res.data.order._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-dark-900 mb-8">Checkout</h1>

        <form onSubmit={handlePlaceOrder}>
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Address + Payment */}
            <div className="lg:col-span-2 space-y-5">
              {/* Delivery Address */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <MapPin className="w-5 h-5 text-primary-500" />
                  <h2 className="text-lg font-bold text-dark-900">Delivery Address</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">Full Name *</label>
                    <input name="fullName" value={address.fullName} onChange={handleAddressChange} className="input-field" placeholder="John Doe" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">Phone *</label>
                    <input name="phone" value={address.phone} onChange={handleAddressChange} className="input-field" placeholder="9876543210" required />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-dark-700 mb-1">Address *</label>
                    <input name="addressLine" value={address.addressLine} onChange={handleAddressChange} className="input-field" placeholder="House/Flat/Street" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">City *</label>
                    <input name="city" value={address.city} onChange={handleAddressChange} className="input-field" placeholder="Ahmedabad" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">State *</label>
                    <input name="state" value={address.state} onChange={handleAddressChange} className="input-field" placeholder="Gujarat" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-700 mb-1">Pincode *</label>
                    <input name="pincode" value={address.pincode} onChange={handleAddressChange} className="input-field" placeholder="380001" required />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-5">
                  <CreditCard className="w-5 h-5 text-primary-500" />
                  <h2 className="text-lg font-bold text-dark-900">Payment Method</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { value: 'cod', icon: <Banknote className="w-5 h-5 text-green-500" />, label: 'Cash on Delivery', desc: 'Pay when your order arrives' },
                    { value: 'online', icon: <CreditCard className="w-5 h-5 text-blue-500" />, label: 'Online Payment', desc: 'Pay via UPI, Card, or Net Banking (Demo)' },
                  ].map(opt => (
                    <label key={opt.value} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-colors ${paymentMethod === opt.value ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input
                        type="radio"
                        name="payment"
                        value={opt.value}
                        checked={paymentMethod === opt.value}
                        onChange={() => setPaymentMethod(opt.value)}
                        className="sr-only"
                      />
                      {opt.icon}
                      <div className="flex-1">
                        <p className="font-semibold text-dark-900 text-sm">{opt.label}</p>
                        <p className="text-xs text-gray-500">{opt.desc}</p>
                      </div>
                      {paymentMethod === opt.value && <CheckCircle className="w-5 h-5 text-primary-500" />}
                    </label>
                  ))}
                </div>

                {paymentMethod === 'online' && (
                  <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-sm text-blue-700">
                    💡 <strong>Demo mode:</strong> Online payment is simulated. Your order will be placed immediately.
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div>
              <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-28">
                <h2 className="font-bold text-dark-900 mb-4">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {cartItems.map(item => (
                    <div key={item._id} className="flex gap-3">
                      <img
                        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=60'}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-dark-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-500">x{item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-dark-900">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>

                <hr className="border-gray-100 mb-4" />

                {/* Totals */}
                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span>₹{deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tax</span>
                    <span>₹{tax.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium">
                      <span>Discount</span>
                      <span>- ₹{discount.toFixed(2)}</span>
                    </div>
                  )}
                  <hr className="border-gray-100" />
                  <div className="flex justify-between text-dark-900 font-bold text-base">
                    <span>Total</span>
                    <span>₹{total.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary w-full mt-6 text-base py-3"
                >
                  {loading ? 'Placing Order...' : `Place Order · ₹${total.toFixed(2)}`}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
