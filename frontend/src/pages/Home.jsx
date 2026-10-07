import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Search, ArrowRight, Star, Clock, ChevronRight, Bike, Shield, Headphones } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { SkeletonCard } from '../components/Loader';
import api from '../services/api';

const CATEGORIES = [
  { name: 'Pizza', emoji: '🍕', color: 'bg-red-50 hover:bg-red-100' },
  { name: 'Burger', emoji: '🍔', color: 'bg-yellow-50 hover:bg-yellow-100' },
  { name: 'Biryani', emoji: '🍛', color: 'bg-orange-50 hover:bg-orange-100' },
  { name: 'Chinese', emoji: '🥢', color: 'bg-green-50 hover:bg-green-100' },
  { name: 'South Indian', emoji: '🥘', color: 'bg-purple-50 hover:bg-purple-100' },
  { name: 'Gujarati', emoji: '🥗', color: 'bg-teal-50 hover:bg-teal-100' },
  { name: 'Desserts', emoji: '🧁', color: 'bg-pink-50 hover:bg-pink-100' },
  { name: 'Beverages', emoji: '🧃', color: 'bg-blue-50 hover:bg-blue-100' },
  { name: 'Sandwich', emoji: '🥪', color: 'bg-amber-50 hover:bg-amber-100' },
  { name: 'Pasta', emoji: '🍝', color: 'bg-lime-50 hover:bg-lime-100' },
];

const HOW_IT_WORKS = [
  { icon: <Search className="w-8 h-8 text-primary-500" />, title: 'Browse & Choose', description: 'Explore top restaurants near you and pick your favourite dishes.' },
  { icon: <ShoppingBagIcon />, title: 'Place Your Order', description: 'Add items to your cart, apply coupons and checkout in seconds.' },
  { icon: <Bike className="w-8 h-8 text-primary-500" />, title: 'Fast Delivery', description: 'Our delivery partners bring your food hot and fresh to your door.' },
];

function ShoppingBagIcon() {
  return (
    <svg className="w-8 h-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}

const Home = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get('/restaurants?limit=6&sort=rating');
        setRestaurants(res.data.restaurants || []);
      } catch (err) {
        setError('Unable to load restaurants. Is the backend running?');
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (cat) => {
    navigate(`/restaurants?cuisine=${encodeURIComponent(cat)}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-orange-700 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-6">
                <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                <span className="text-sm font-medium">Rated #1 Food Delivery App</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4">
                Delicious food,<br />
                <span className="text-yellow-300">delivered</span> to<br />
                your door.
              </h1>
              <p className="text-white/80 text-lg mb-8">
                Good Food. Fast Delivery. Order from 500+ restaurants in minutes.
              </p>

              {/* Search bar */}
              <form onSubmit={handleSearch} className="flex gap-3 bg-white rounded-2xl p-2 shadow-2xl max-w-lg">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for restaurants or dishes..."
                    className="w-full pl-10 pr-4 py-3 text-dark-900 bg-transparent outline-none text-sm placeholder-gray-400"
                  />
                </div>
                <button type="submit" className="btn-primary py-3 px-5 text-sm flex items-center gap-2 flex-shrink-0">
                  Find Food <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center gap-6 mt-6 text-white/70 text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> 30 min avg delivery
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4" /> Safe & hygienic
                </div>
              </div>
            </div>

            {/* Hero image */}
            <div className="hidden md:block">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600"
                  alt="Delicious food"
                  className="rounded-3xl shadow-2xl w-full object-cover h-80"
                />
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-2xl">🍕</div>
                  <div>
                    <p className="font-bold text-dark-900 text-sm">Margherita Pizza</p>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>4.8 • 20 min</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Food Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">What are you craving?</h2>
        </div>
        <div className="grid grid-cols-5 sm:grid-cols-5 md:grid-cols-10 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              onClick={() => handleCategoryClick(cat.name)}
              className={`${cat.color} rounded-2xl p-3 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95`}
            >
              <span className="text-3xl">{cat.emoji}</span>
              <span className="text-xs font-semibold text-dark-700 text-center leading-tight">{cat.name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Popular Restaurants */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Top Restaurants</h2>
          <Link to="/restaurants" className="flex items-center gap-1 text-primary-500 font-semibold text-sm hover:gap-2 transition-all">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm mb-6">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : restaurants.map((r) => <RestaurantCard key={r._id} restaurant={r} />)
          }
        </div>
      </section>

      {/* Offers Banner */}
      <section className="bg-gradient-to-r from-primary-500 to-orange-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { code: 'WELCOME50', title: '₹50 OFF', desc: 'On your first order above ₹200', icon: '🎉' },
              { code: 'SPICE20', title: '20% OFF', desc: 'On orders above ₹399 from Spice Garden', icon: '🌶️' },
              { code: 'LOYAL10', title: '10% OFF', desc: 'Loyalty reward for repeat customers', icon: '⭐' },
            ].map((offer) => (
              <div key={offer.code} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 text-white">
                <span className="text-3xl mb-3 block">{offer.icon}</span>
                <h3 className="text-xl font-black">{offer.title}</h3>
                <p className="text-white/80 text-sm mt-1">{offer.desc}</p>
                <div className="mt-3 bg-white/20 rounded-lg px-3 py-1.5 inline-block">
                  <code className="text-sm font-bold tracking-wider">{offer.code}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="section-title text-center mb-14">How BiteGo Works</h2>
        <div className="grid md:grid-cols-3 gap-10">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="text-center group">
              <div className="w-20 h-20 bg-primary-50 rounded-3xl flex items-center justify-center mx-auto mb-5 group-hover:bg-primary-500 transition-colors duration-300 group-hover:scale-110 transform">
                <div className="group-hover:text-white transition-colors">{step.icon}</div>
              </div>
              <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold mx-auto mb-4">
                {i + 1}
              </div>
              <h3 className="font-bold text-dark-900 text-lg mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats section */}
      <section className="bg-dark-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '500+', label: 'Restaurants' },
              { value: '50K+', label: 'Happy Customers' },
              { value: '1M+', label: 'Orders Delivered' },
              { value: '4.8★', label: 'App Rating' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-black text-primary-400">{stat.value}</p>
                <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
