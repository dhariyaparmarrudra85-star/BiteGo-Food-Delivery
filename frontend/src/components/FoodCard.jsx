import { Plus, Minus, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

const FoodCard = ({ food }) => {
  const { cartItems, addToCart, updateQuantity } = useCart();

  const cartItem = cartItems.find((item) => item.food?._id === food._id || item.food === food._id);
  const quantity = cartItem?.quantity || 0;

  const handleAdd = () => addToCart(food._id, 1);
  const handleIncrease = () => updateQuantity(cartItem._id, quantity + 1);
  const handleDecrease = () => updateQuantity(cartItem._id, quantity - 1);

  return (
    <div className="flex gap-4 py-5 border-b border-gray-100 last:border-0 group">
      {/* Image */}
      <div className="relative w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden">
        <img
          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
          alt={food.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'; }}
        />
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2">
          {/* Veg/Non-veg indicator */}
          <div className={`mt-0.5 w-4 h-4 border-2 flex-shrink-0 flex items-center justify-center rounded-sm ${food.isVeg ? 'border-green-600' : 'border-red-600'}`}>
            <div className={`w-2 h-2 rounded-full ${food.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-dark-900 truncate">{food.name}</h4>
            {food.rating > 0 && (
              <div className="flex items-center gap-1 mt-0.5">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-gray-500">{food.rating}</span>
              </div>
            )}
            <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{food.description}</p>
            <p className="font-bold text-dark-900 mt-2">₹{food.price}</p>
          </div>
        </div>
      </div>

      {/* Add to cart */}
      <div className="flex-shrink-0 flex flex-col items-end justify-end">
        {quantity === 0 ? (
          <button
            onClick={handleAdd}
            disabled={!food.isAvailable}
            className="btn-primary text-sm py-2 px-4 flex items-center gap-1"
          >
            <Plus className="w-4 h-4" />
            ADD
          </button>
        ) : (
          <div className="flex items-center gap-1 border-2 border-primary-500 rounded-xl overflow-hidden">
            <button onClick={handleDecrease} className="p-2 text-primary-500 hover:bg-primary-50 transition-colors">
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-primary-600 text-sm">{quantity}</span>
            <button onClick={handleIncrease} className="p-2 text-primary-500 hover:bg-primary-50 transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>
        )}
        {!food.isAvailable && (
          <p className="text-xs text-red-400 mt-1">Unavailable</p>
        )}
      </div>
    </div>
  );
};

export default FoodCard;
