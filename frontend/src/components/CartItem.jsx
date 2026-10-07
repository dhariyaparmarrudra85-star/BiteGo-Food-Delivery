import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0 group">
      <img
        src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
        alt={item.name}
        className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'; }}
      />

      <div className="flex-1 min-w-0">
        <p className="font-semibold text-dark-900 text-sm truncate">{item.name}</p>
        <p className="text-primary-500 font-bold mt-1">₹{(item.price * item.quantity).toFixed(2)}</p>
        <p className="text-xs text-gray-400">₹{item.price} each</p>
      </div>

      <div className="flex flex-col items-end gap-2">
        <button
          onClick={() => removeItem(item._id)}
          className="text-gray-300 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 border border-gray-200 rounded-lg overflow-hidden">
          <button
            onClick={() => updateQuantity(item._id, item.quantity - 1)}
            className="p-1.5 hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
          <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item._id, item.quantity + 1)}
            className="p-1.5 hover:bg-gray-50 text-gray-600 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
