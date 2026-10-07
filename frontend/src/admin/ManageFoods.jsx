import { useState, useEffect } from 'react';
import { Plus, Trash2, Search, Edit } from 'lucide-react';
import api from '../services/api';
import { PageLoader } from '../components/Loader';
import toast from 'react-hot-toast';

const ManageFoods = () => {
  const [foods, setFoods] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 199,
    category: 'Main Course',
    isVeg: true,
    restaurant: '',
    image: '',
    isAvailable: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fRes, rRes] = await Promise.all([
        api.get('/foods?limit=100'),
        api.get('/restaurants?limit=100'),
      ]);
      if (fRes.data.success) setFoods(fRes.data.foods || []);
      if (rRes.data.success) {
        setRestaurants(rRes.data.restaurants || []);
        if (rRes.data.restaurants?.length > 0) {
          setForm((prev) => ({ ...prev, restaurant: rRes.data.restaurants[0]._id }));
        }
      }
    } catch (err) {
      toast.error('Failed to load foods list');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this food item?')) return;
    try {
      const res = await api.delete(`/foods/${id}`);
      if (res.data.success) {
        toast.success('Food item removed');
        setFoods(foods.filter((f) => f._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/foods', form);
      if (res.data.success) {
        toast.success('Food item added successfully!');
        setShowModal(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add food');
    }
  };

  const filtered = foods.filter(
    (f) =>
      f.name?.toLowerCase().includes(search.toLowerCase()) ||
      f.category?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Manage Food Items</h1>
          <p className="text-gray-500 text-sm mt-1">{foods.length} items currently on platform menus</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search dishes..."
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
            />
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-orange-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            Add Dish
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Dish</th>
                <th className="py-3.5 px-6 font-semibold">Restaurant</th>
                <th className="py-3.5 px-6 font-semibold">Category</th>
                <th className="py-3.5 px-6 font-semibold">Price</th>
                <th className="py-3.5 px-6 font-semibold">Type</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-xs font-medium">
                    {item.restaurant?.name || 'Restaurant'}
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-xs">
                    {item.category}
                  </td>
                  <td className="py-4 px-6 font-bold text-gray-900">
                    ₹{item.price}
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${
                        item.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => handleDelete(item._id)}
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
            <h3 className="text-xl font-bold text-gray-900">Add New Dish</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Restaurant</label>
                <select
                  required
                  value={form.restaurant}
                  onChange={(e) => setForm({ ...form, restaurant: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                >
                  {restaurants.map((r) => (
                    <option key={r._id} value={r._id}>{r.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Butter Paneer Masala"
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description</label>
                <textarea
                  rows="2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Rich cottage cheese cooked in creamy tomato butter gravy..."
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
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
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isVeg"
                  checked={form.isVeg}
                  onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
                  className="w-4 h-4 text-orange-500 rounded"
                />
                <label htmlFor="isVeg" className="text-sm font-medium text-gray-700">Vegetarian Dish</label>
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
                  Save Dish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageFoods;
