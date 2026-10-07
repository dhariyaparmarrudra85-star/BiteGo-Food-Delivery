import { Link } from 'react-router-dom';
import { ShoppingCart, Trash2, Tag, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { EmptyState } from '../components/Loader';

const Cart = () => {
  const { cart, cartItems, subtotal, deliveryFee, tax, discount, total, clearCart, applyCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponLoading(true);
    await applyCoupon(couponCode.toUpperCase());
    setCouponLoading(false);
    setCouponCode('');
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-dark-900 mb-8 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary-500" /> Your Cart
          </h1>
          <EmptyState
            icon="🛒"
            title="Your cart is empty"
            description="Add some delicious food from our restaurants!"
            action={
              <Link to="/restaurants" className="btn-primary">
                Browse Restaurants
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-dark-900 flex items-center gap-2">
            <ShoppingCart className="w-6 h-6 text-primary-500" />
            Your Cart ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
          </h1>
          <button
            onClick={clearCart}
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Restaurant info */}
            {cart?.restaurant && (
              <div className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-3">
                <img
                  src={cart.restaurant.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=100'}
                  alt={cart.restaurant.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <p className="font-semibold text-dark-900">{cart.restaurant.name}</p>
                  <p className="text-xs text-gray-500">All items from this restaurant</p>
                </div>
              </div>
            )}

            {/* Cart items */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              {cartItems.map(item => <CartItem key={item._id} item={item} />)}
            </div>

            {/* Coupon */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="w-4 h-4 text-primary-500" />
                <h3 className="font-semibold text-dark-900">Apply Coupon</h3>
              </div>
              <form onSubmit={handleApplyCoupon} className="flex gap-3">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="input-field flex-1 py-2.5 text-sm uppercase tracking-widest"
                />
                <button
                  type="submit"
                  disabled={couponLoading || !couponCode}
                  className="btn-primary text-sm py-2.5 px-5"
                >
                  {couponLoading ? '...' : 'Apply'}
                </button>
              </form>
              <p className="text-xs text-gray-400 mt-2">
                Try: WELCOME50 · SPICE20 · FIRST15 · DRAGON60 · LOYAL10
              </p>
            </div>
          </div>

          {/* Bill summary */}
          <div>
            <div className="bg-white rounded-2xl shadow-sm p-5 sticky top-28">
              <h3 className="font-bold text-dark-900 mb-4">Bill Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Item Total</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>₹{deliveryFee}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Coupon Discount</span>
                    <span>- ₹{discount.toFixed(2)}</span>
                  </div>
                )}
                <hr className="border-gray-100" />
                <div className="flex justify-between text-dark-900 font-bold text-base">
                  <span>Grand Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <Link
                to="/checkout"
                className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
              >
                Proceed to Checkout <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                <span>🔒</span>
                <span>100% secure checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
