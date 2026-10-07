import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { SkeletonCard, EmptyState } from '../components/Loader';
import api from '../services/api';

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [restaurants, setRestaurants] = useState([]);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('restaurants');

  const doSearch = async (q) => {
    if (!q.trim()) { setRestaurants([]); setFoods([]); return; }
    try {
      setLoading(true);
      const [restRes, foodRes] = await Promise.all([
        api.get(`/restaurants?search=${encodeURIComponent(q)}&limit=12`),
        api.get(`/foods?search=${encodeURIComponent(q)}&limit=20`),
      ]);
      setRestaurants(restRes.data.restaurants || []);
      setFoods(foodRes.data.foods || []);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    doSearch(q);
  }, [searchParams]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchParams(query ? { q: query } : {});
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30 py-4">
        <div className="max-w-4xl mx-auto px-4">
          <form onSubmit={handleSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search restaurants, foods, cuisines..."
                className="input-field pl-10 py-3"
                autoFocus
              />
            </div>
            <button type="submit" className="btn-primary px-6">Search</button>
          </form>

          {/* Tabs */}
          {(restaurants.length > 0 || foods.length > 0) && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setActiveTab('restaurants')}
                className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${activeTab === 'restaurants' ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-500'}`}
              >
                Restaurants ({restaurants.length})
              </button>
              <button
                onClick={() => setActiveTab('foods')}
                className={`text-sm font-semibold pb-2 border-b-2 transition-colors ${activeTab === 'foods' ? 'border-primary-500 text-primary-500' : 'border-transparent text-gray-500'}`}
              >
                Food Items ({foods.length})
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {!query && (
          <EmptyState
            icon="🔍"
            title="What are you looking for?"
            description="Search for your favourite restaurants, dishes, or cuisines."
          />
        )}

        {loading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {!loading && query && (
          <>
            {activeTab === 'restaurants' && (
              restaurants.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
                </div>
              ) : (
                <EmptyState icon="🍽️" title="No restaurants found" description={`No restaurants match "${query}".`} />
              )
            )}

            {activeTab === 'foods' && (
              foods.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {foods.map(food => (
                    <Link key={food._id} to={`/restaurants/${food.restaurant?._id || food.restaurant}`} className="card p-4 flex gap-4 hover:shadow-md transition-shadow">
                      <img
                        src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                        alt={food.name}
                        className="w-20 h-20 rounded-xl object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-3 h-3 border-2 rounded-sm flex items-center justify-center ${food.isVeg ? 'border-green-600' : 'border-red-600'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${food.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                          </div>
                          <p className="font-semibold text-dark-900 text-sm truncate">{food.name}</p>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{food.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-dark-900">₹{food.price}</span>
                          <span className="text-xs text-gray-400">{food.restaurant?.name}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState icon="🍕" title="No food items found" description={`No dishes match "${query}".`} />
              )
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
