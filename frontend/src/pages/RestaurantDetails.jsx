import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Bike, MapPin, ChevronLeft, Info } from 'lucide-react';
import FoodCard from '../components/FoodCard';
import { PageLoader, EmptyState } from '../components/Loader';
import api from '../services/api';

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, foodRes, reviewRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/foods/restaurant/${id}`),
          api.get(`/restaurants/${id}/reviews`),
        ]);
        setRestaurant(restRes.data.restaurant);
        setFoods(foodRes.data.foods || []);
        setReviews(reviewRes.data.reviews || []);
      } catch {
        setError('Failed to load restaurant details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <PageLoader />;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">{error}</div>;
  if (!restaurant) return null;

  // Group foods by category
  const categories = ['All', ...new Set(foods.map(f => f.category))];
  const filteredFoods = activeCategory === 'All'
    ? foods
    : foods.filter(f => f.category === activeCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-56 md:h-72 overflow-hidden bg-gray-200">
        <img
          src={restaurant.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200'}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

        <Link
          to="/restaurants"
          className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow hover:bg-white transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-dark-800" />
        </Link>

        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl font-black">{restaurant.name}</h1>
          <p className="text-white/80 text-sm mt-1">
            {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(' • ') : restaurant.cuisine}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Restaurant Info Card */}
        <div className="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 px-3 py-1.5 rounded-xl">
              <Star className="w-4 h-4 fill-green-500 text-green-500" />
              <span className="font-bold">{restaurant.rating?.toFixed(1) || '4.0'}</span>
              <span className="text-green-500 text-sm">({restaurant.totalRatings} ratings)</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 text-sm">
              <Clock className="w-4 h-4 text-primary-500" />
              <span>{restaurant.deliveryTime} min</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 text-sm">
              <Bike className="w-4 h-4 text-primary-500" />
              <span>₹{restaurant.deliveryFee} delivery fee</span>
            </div>
            <div className="text-gray-600 text-sm">₹{restaurant.priceForTwo} for two</div>
            <div className={`text-sm font-semibold px-3 py-1 rounded-full ${restaurant.isOpen ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
              {restaurant.isOpen ? '🟢 Open Now' : '🔴 Closed'}
            </div>
          </div>

          {restaurant.description && (
            <div className="flex items-start gap-2 mt-4 p-3 bg-gray-50 rounded-xl">
              <Info className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">{restaurant.description}</p>
            </div>
          )}

          {restaurant.address && (
            <div className="flex items-center gap-2 mt-3 text-sm text-gray-500">
              <MapPin className="w-4 h-4 text-primary-500 flex-shrink-0" />
              <span>
                {[restaurant.address.street, restaurant.address.city, restaurant.address.state].filter(Boolean).join(', ')}
              </span>
            </div>
          )}

          {/* Offers */}
          {restaurant.offers?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {restaurant.offers.map((offer, i) => (
                <div key={i} className="flex items-center gap-1.5 bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold px-3 py-1.5 rounded-xl">
                  🏷️ {offer.title}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Menu */}
        <div className="grid md:grid-cols-4 gap-6">
          {/* Category sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm p-4 sticky top-28">
              <h3 className="font-bold text-sm text-dark-700 mb-3">MENU</h3>
              <nav className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-primary-50 text-primary-600 border-l-4 border-primary-500' : 'text-gray-600 hover:bg-gray-50'}`}
                  >
                    {cat}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Food items */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="text-lg font-bold text-dark-900 mb-2">{activeCategory}</h2>
              <p className="text-sm text-gray-500 mb-4">{filteredFoods.length} item{filteredFoods.length !== 1 ? 's' : ''}</p>

              {filteredFoods.length === 0 ? (
                <EmptyState icon="🍽️" title="No items" description="No items available in this category." />
              ) : (
                <div>
                  {filteredFoods.map(food => <FoodCard key={food._id} food={food} />)}
                </div>
              )}
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-5 mt-6">
                <h2 className="text-lg font-bold text-dark-900 mb-4">Customer Reviews</h2>
                <div className="space-y-4">
                  {reviews.slice(0, 5).map(review => (
                    <div key={review._id} className="flex gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-full flex items-center justify-center text-sm font-bold text-primary-600 flex-shrink-0">
                        {review.user?.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{review.user?.name || 'Customer'}</span>
                          <div className="flex gap-0.5">
                            {Array(5).fill(0).map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        {review.comment && <p className="text-sm text-gray-600 mt-1">{review.comment}</p>}
                        <p className="text-xs text-gray-400 mt-1">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;
