import { Link } from 'react-router-dom';
import { Star, Clock, Bike, Heart } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

const RestaurantCard = ({ restaurant, onFavoriteToggle }) => {
  const { user } = useAuth();
  const [isFav, setIsFav] = useState(
    user?.favorites?.includes(restaurant._id) || false
  );
  const [favLoading, setFavLoading] = useState(false);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast.error('Please login to save favorites'); return; }
    try {
      setFavLoading(true);
      await api.post(`/users/favorites/${restaurant._id}`);
      setIsFav(!isFav);
      toast.success(isFav ? 'Removed from favorites' : 'Added to favorites');
      if (onFavoriteToggle) onFavoriteToggle(restaurant._id);
    } catch {
      toast.error('Failed to update favorites');
    } finally {
      setFavLoading(false);
    }
  };

  return (
    <Link to={`/restaurants/${restaurant._id}`} className="card group block">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'}
          alt={restaurant.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400'; }}
        />
        {/* Offer badge */}
        {restaurant.offers?.length > 0 && (
          <div className="absolute bottom-3 left-3 bg-primary-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
            {restaurant.offers[0].title}
          </div>
        )}
        {/* Favorite button */}
        <button
          onClick={handleFavorite}
          disabled={favLoading}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
        >
          <Heart
            className={`w-4 h-4 transition-colors ${isFav ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
          />
        </button>
        {/* Closed overlay */}
        {!restaurant.isOpen && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-dark-800/80 px-4 py-2 rounded-xl">Closed</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-dark-900 text-base group-hover:text-primary-500 transition-colors truncate">
              {restaurant.name}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5 truncate">
              {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(' • ') : restaurant.cuisine}
            </p>
          </div>
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg flex-shrink-0">
            <Star className="w-3.5 h-3.5 fill-green-500 text-green-500" />
            <span className="text-sm font-bold">{restaurant.rating?.toFixed(1) || '4.0'}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{restaurant.deliveryTime || 30} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Bike className="w-3.5 h-3.5" />
            <span>₹{restaurant.deliveryFee || 30} delivery</span>
          </div>
          <span>₹{restaurant.priceForTwo} for two</span>
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
