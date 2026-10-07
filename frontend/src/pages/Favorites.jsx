import { useState, useEffect } from 'react';
import { Heart, Search } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { PageLoader, EmptyState } from '../components/Loader';
import api from '../services/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const res = await api.get('/users/favorites');
      if (res.data.success) {
        setFavorites(res.data.favorites || []);
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (restaurantId) => {
    // Remove locally if toggled off
    setFavorites((prev) => prev.filter((r) => r._id !== restaurantId));
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 flex items-center gap-3">
          <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
          My Favorite Restaurants
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Quickly re-order from the places you love most
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites saved"
          message="Tap the heart icon on any restaurant card to save it here for quick access later."
          buttonText="Explore Restaurants"
          buttonLink="/restaurants"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favorites.map((restaurant) => (
            <RestaurantCard
              key={restaurant._id}
              restaurant={restaurant}
              onFavoriteToggle={() => handleFavoriteToggle(restaurant._id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
