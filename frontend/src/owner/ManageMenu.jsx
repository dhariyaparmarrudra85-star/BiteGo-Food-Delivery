import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Check, X, Search, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import { PageLoader } from '../components/Loader';
import toast from 'react-hot-toast';

const ManageMenu = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingFood, setEditingFood] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: 150,
    category: 'Main Course',
    isVeg: true,
    image: '',
    isAvailable: true,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const rRes = await api.get('/restaurants/owner/mine');
      if (rRes.data?.restaurant) {
        setRestaurant(rRes.data.restaurant);
        const fRes = await api.get(`/foods?restaurant=${rRes.data.restaurant._id}&limit=100`);
        if (fRes.data.success) {
          setFoods(fRes.data.foods || []);
        }
      }
    } catch (err) {
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (food = null) => {
    if (food) {
      setEditingFood(food);
      setForm({
        name: food.name,
        description: food.description,
        price: food.price,
        category: food.category,
        isVeg: food.isVeg,
        image: food.image,
        isAvailable: food.isAvailable,
      });
    } else {
      setEditingFood(null);
      setForm({
        name: '',
        description: '',
        price: 150,
        category: 'Main Course',
        isVeg: true,
        image: '',
        isAvailable: true,
      });
    }
    setShowModal(true);
  };

  const handleToggleAvailability = async (food) => {
    try {
      const res = await api.put(`/foods/${food._id}`, { isAvailable: !food.isAvailable });
      if (res.data.success) {
        toast.success(`Marked as ${!food.isAvailable ? 'Available' : 'Unavailable'}`);
        setFoods(foods.map((f) => (f._id === food._id ? { ...f, isAvailable: !food.isAvailable } : f)));
      }
    } catch (err) {
      toast.error('Failed to update availability');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      const res = await api.delete(`/foods/${id}`);
      if (res.data.success) {
        toast.success('Food item deleted');
        setFoods(foods.filter((f) => f._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete food');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!restaurant) {
      toast.error('Please configure your restaurant first!');
      return;
    }

    try {
      if (editingFood) {
        const res = await api.put(`/foods/${editingFood._id}`, form);
        if (res.data.success) {
          toast.success('Menu item updated!');
          setShowModal(false);
          fetchData();
        }
      } else {
        const res = await api.post('/foods', { ...form, restaurant: restaurant._id });
        if (res.data.success) {
          toast.success('New menu item added!');
          setShowModal(false);
          fetchData();
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save menu item');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Manage Menu</h1>
          <p className="text-gray-500 text-sm mt-1">
            {restaurant ? `${restaurant.name} • ${foods.length} dishes on menu` : 'Manage your offerings'}
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-orange-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Add New Dish
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="py-3.5 px-6 font-semibold">Dish</th>
                <th className="py-3.5 px-6 font-semibold">Category</th>
                <th className="py-3.5 px-6 font-semibold">Price</th>
                <th className="py-3.5 px-6 font-semibold">Type</th>
                <th className="py-3.5 px-6 font-semibold">Availability</th>
                <th className="py-3.5 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {foods.map((food) => (
                <tr key={food._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={food.image}
                        alt={food.name}
                        className="w-12 h-12 rounded-xl object-cover"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100';
                        }}
                      />
                      <div>
                        <p className="font-semibold text-gray-900">{food.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{food.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-600 text-xs">{food.category}</td>
                  <td className="py-4 px-6 font-bold text-gray-900">₹{food.price}</td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-md ${
                        food.isVeg ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {food.isVeg ? 'Veg' : 'Non-Veg'}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <button
                      onClick={() => handleToggleAvailability(food)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                        food.isAvailable
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                    >
                      {food.isAvailable ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenModal(food)}
                        className="p-1.5 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(food._id)}
                        className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {foods.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 text-sm">
                    No dishes created for this restaurant yet. Click "Add New Dish" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-4 my-8">
            <h3 className="text-xl font-bold text-gray-900">
              {editingFood ? 'Edit Dish' : 'Add New Dish to Menu'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Dish Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Paneer Tikka Masala"
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Description</label>
                <textarea
                  rows="2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Delicious dish description..."
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
                  id="isVegOwner"
                  checked={form.isVeg}
                  onChange={(e) => setForm({ ...form, isVeg: e.target.checked })}
                  className="w-4 h-4 text-orange-500 rounded"
                />
                <label htmlFor="isVegOwner" className="text-sm font-medium text-gray-700">Vegetarian Dish</label>
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
                  {editingFood ? 'Save Changes' : 'Add to Menu'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageMenu;
