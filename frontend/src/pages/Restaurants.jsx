import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import RestaurantCard from '../components/RestaurantCard';
import { SkeletonCard, EmptyState } from '../components/Loader';
import api from '../services/api';

const CUISINES = ['North Indian', 'South Indian', 'Chinese', 'Italian', 'Gujarati', 'Biryani', 'Fast Food', 'Street Food', 'Desserts'];
const SORT_OPTIONS = [
  { value: '', label: 'Recommended' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'deliveryTime', label: 'Fastest Delivery' },
  { value: 'priceForTwo', label: 'Price (Low to High)' },
  { value: 'popularity', label: 'Most Popular' },
];

const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [total, setTotal] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    cuisine: searchParams.get('cuisine') || '',
    rating: searchParams.get('rating') || '',
    sort: searchParams.get('sort') || '',
  });

  const fetchRestaurants = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.set('search', filters.search);
      if (filters.cuisine) params.set('cuisine', filters.cuisine);
      if (filters.rating) params.set('rating', filters.rating);
      if (filters.sort) params.set('sort', filters.sort);

      const res = await api.get(`/restaurants?${params.toString()}&limit=20`);
      setRestaurants(res.data.restaurants || []);
      setTotal(res.data.total || 0);
    } catch {
      setError('Failed to load restaurants. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchRestaurants();
  }, [fetchRestaurants]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ search: '', cuisine: '', rating: '', sort: '' });
    setSearchParams({});
  };

  const hasActiveFilters = filters.search || filters.cuisine || filters.rating || filters.sort;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                placeholder="Search restaurants, cuisines..."
                className="input-field pl-10 py-2.5 text-sm"
              />
            </div>

            {/* Sort */}
            <select
              value={filters.sort}
              onChange={(e) => updateFilter('sort', e.target.value)}
              className="input-field py-2.5 text-sm w-full sm:w-48"
            >
              {SORT_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${showFilters ? 'border-primary-500 bg-primary-50 text-primary-600' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}
            >
              <SlidersHorizontal className="w-4 h-4" /> Filters
            </button>

            {hasActiveFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600 px-3">
                <X className="w-4 h-4" /> Clear
              </button>
            )}
          </div>

          {/* Filter panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-200 animate-fade-in">
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Cuisine */}
                <div>
                  <p className="text-sm font-semibold text-dark-700 mb-2">Cuisine</p>
                  <div className="flex flex-wrap gap-2">
                    {CUISINES.map(c => (
                      <button
                        key={c}
                        onClick={() => updateFilter('cuisine', filters.cuisine === c ? '' : c)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filters.cuisine === c ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating */}
                <div>
                  <p className="text-sm font-semibold text-dark-700 mb-2">Minimum Rating</p>
                  <div className="flex gap-2">
                    {['3', '3.5', '4', '4.5'].map(r => (
                      <button
                        key={r}
                        onClick={() => updateFilter('rating', filters.rating === r ? '' : r)}
                        className={`text-xs px-3 py-1.5 rounded-full border font-medium transition-colors ${filters.rating === r ? 'bg-primary-500 text-white border-primary-500' : 'border-gray-200 text-gray-600 hover:border-primary-300'}`}
                      >
                        {r}★+
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!loading && !error && (
          <p className="text-sm text-gray-500 mb-6">
            {total} restaurant{total !== 1 ? 's' : ''} found
            {filters.cuisine && ` for "${filters.cuisine}"`}
          </p>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm mb-6">
            ⚠️ {error}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? Array(9).fill(0).map((_, i) => <SkeletonCard key={i} />)
            : restaurants.map(r => <RestaurantCard key={r._id} restaurant={r} />)
          }
        </div>

        {!loading && !error && restaurants.length === 0 && (
          <EmptyState
            icon="🔍"
            title="No restaurants found"
            description="Try adjusting your search or filters."
            action={
              <button onClick={clearFilters} className="btn-primary">
                Clear Filters
              </button>
            }
          />
        )}
      </div>
    </div>
  );
};

export default Restaurants;
