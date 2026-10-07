import { useState, useEffect } from 'react';
import { Store, Save, Clock, MapPin, DollarSign, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';
import { PageLoader } from '../components/Loader';
import toast from 'react-hot-toast';

const RestaurantSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    cuisine: 'North Indian, Mughlai',
    deliveryTime: '30-40 mins',
    priceForTwo: 500,
    isOpen: true,
    image: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const fetchRestaurant = async () => {
    try {
      const res = await api.get('/restaurants/owner/mine');
      if (res.data?.restaurant) {
        const r = res.data.restaurant;
        setRestaurantId(r._id);
        setForm({
          name: r.name || '',
          description: r.description || '',
          cuisine: Array.isArray(r.cuisine) ? r.cuisine.join(', ') : r.cuisine || '',
          deliveryTime: r.deliveryTime || '30-40 mins',
          priceForTwo: r.priceForTwo || 500,
          isOpen: r.isOpen !== undefined ? r.isOpen : true,
          image: r.image || '',
          street: r.address?.street || '',
          city: r.address?.city || '',
          state: r.address?.state || '',
          pincode: r.address?.pincode || '',
        });
      }
    } catch (err) {
      // Restaurant might not exist yet for this owner
      console.log('No restaurant found for owner, user can create one.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        cuisine: form.cuisine.split(',').map((c) => c.trim()),
        deliveryTime: form.deliveryTime,
        priceForTwo: Number(form.priceForTwo),
        isOpen: form.isOpen,
        image: form.image,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          pincode: form.pincode,
        },
      };

      if (restaurantId) {
        await api.put(`/restaurants/${restaurantId}`, payload);
        toast.success('Restaurant profile updated successfully!');
      } else {
        const res = await api.post('/restaurants', payload);
        if (res.data.success) {
          setRestaurantId(res.data.restaurant._id);
          toast.success('Restaurant created successfully!');
        }
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save restaurant details');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
          Restaurant Settings
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Configure your restaurant profile, store hours, pricing and location
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-orange-50/60 border border-orange-100 rounded-2xl">
            <div>
              <p className="font-bold text-gray-900 text-sm">Store Availability</p>
              <p className="text-xs text-gray-500">Toggle whether your kitchen is open to receive new customer orders</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.isOpen}
                onChange={(e) => setForm({ ...form, isOpen: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-500"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Spice Route Kitchen"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Description
              </label>
              <textarea
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Tell foodies about your kitchen's history and signature flavors..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Cuisines (comma separated)
              </label>
              <input
                type="text"
                required
                value={form.cuisine}
                onChange={(e) => setForm({ ...form, cuisine: e.target.value })}
                placeholder="Biryani, North Indian, Kebabs"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Avg. Delivery Time
              </label>
              <input
                type="text"
                value={form.deliveryTime}
                onChange={(e) => setForm({ ...form, deliveryTime: e.target.value })}
                placeholder="25-35 mins"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Price for Two (₹)
              </label>
              <input
                type="number"
                value={form.priceForTwo}
                onChange={(e) => setForm({ ...form, priceForTwo: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
              />
            </div>
          </div>

          <h3 className="text-base font-bold text-gray-900 pt-4 border-t border-gray-100 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-orange-500" />
            Kitchen Location
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Street Address</label>
              <input
                type="text"
                value={form.street}
                onChange={(e) => setForm({ ...form, street: e.target.value })}
                placeholder="Shop 12, Ground Floor, Food Street"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">City</label>
              <input
                type="text"
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Ahmedabad"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">State</label>
              <input
                type="text"
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                placeholder="Gujarat"
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg shadow-orange-500/20 transition-all text-sm disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Restaurant Details'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantSettings;
