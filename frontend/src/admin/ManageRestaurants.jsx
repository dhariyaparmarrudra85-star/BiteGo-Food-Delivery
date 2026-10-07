import { useState, useEffect } from 'react';
import { Store, Plus, Trash2, Edit, Star, Search } from 'lucide-react';
import api from '../services/api';
import { PageLoader } from '../components/Loader';
import toast from 'react-hot-toast';

const ManageRestaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    cuisine: 'North Indian',
    deliveryTime: '25-35 mins',
    priceForTwo: 400,
    address: { street: '', city: '', state: '', pincode: '' },
    isOpen: true,
  });

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await api.get('/restaurants?limit=100');
      if (res.data.success) {
        setRestaurants(res.data.restaurants || []);
      }
    } catch (err) {
      toast.error('Failed to load restaurants');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this restaurant? All attached food items will remain orphaned or deleted.')) return;
    try {
      const res = await api.delete(`/restaurants/${id}`);
      if (res.data.success) {
        toast.success('Restaurant removed');
        setRestaurants(restaurants.filter((r) => r._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/restaurants', form);
      if (res.data.success) {
        toast.success('Restaurant created successfully!');
        setShowModal(false);
        fetchRestaurants();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create restaurant');
    }
  };

  const filtered = restaurants.filter((r) =>
    r.name?.toLowerCase().includes(search.toLowerCase()) ||
    (Array.isArray(r.cuisine) ? r.cuisine.join(' ') : r.cuisine)?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Manage Restaurants</h1>
          <p className="text-gray-500 text-sm mt-1">{restaurants.length} active restaurant partners on BiteGo</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search restaurants..."
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-orange-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Restaurant
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Restaurant</th>
                <th className="py-3.5 px-6 font-semibold">Cuisine</th>
                <th className="py-3.5 px-6 font-semibold">Rating</th>
                <th className="py-3.5 px-6 font-semibold">Price for Two</th>
                <th className="py-3.5 px-6 font-semibold">Status</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="w-12 h-12 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=100';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{r.name}</p>
                        <p className="text-xs text-gray-400">{r.address?.city || 'India'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-xs">
                    {Array.isArray(r.cuisine) ? r.cuisine.join(', ') : r.cuisine}
                  </td>
                  <td className="py-4 px-6">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-gray-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {r.rating?.toFixed(1) || '4.0'}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-800">
                    ₹{r.priceForTwo}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        r.isOpen ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {r.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(r._id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 my-8">
            <h3 className="text-xl font-bold text-gray-900">Add New Partner Restaurant</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Royal Biryani Kitchen"
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description</label>
                <textarea
                  rows="2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Authentic royal dum biryani and Mughlai specialties..."
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Cuisines (comma separated)</label>
                  <input
                    type="text"
                    required
                    value={form.cuisine}
                    onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Price for Two (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.priceForTwo}
                    onChange={(e) => setForm({ ...form, priceForTwo: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Delivery Time</label>
                  <input
                    type="text"
                    value={form.deliveryTime}
                    onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
                    placeholder="25-35 mins"
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Image URL</label>
                  <input
                    type="url"
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Street / Area</label>
                  <input
                    type="text"
                    value={form.address.street}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, street: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">City</label>
                  <input
                    type="text"
                    value={form.address.city}
                    onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 rounded-xl shadow-md"
                >
                  Create Restaurant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageRestaurants;
