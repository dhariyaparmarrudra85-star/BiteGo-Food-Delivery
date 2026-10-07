import { useState, useEffect } from 'react';
import { Tag, Plus, Trash2, Calendar, Percent } from 'lucide-react';
import api from '../services/api';
import { PageLoader } from '../components/Loader';
import toast from 'react-hot-toast';

const ManageCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 20,
    minimumOrder: 299,
    maximumDiscount: 100,
    expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await api.get('/coupons');
      if (res.data.success) {
        setCoupons(res.data.coupons || []);
      }
    } catch (err) {
      toast.error('Failed to load coupons');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const res = await api.delete(`/coupons/${id}`);
      if (res.data.success) {
        toast.success('Coupon removed');
        setCoupons(coupons.filter((c) => c._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete coupon');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/coupons', {
        ...form,
        code: form.code.toUpperCase().trim(),
      });
      if (res.data.success) {
        toast.success('Coupon created successfully!');
        setShowModal(false);
        fetchCoupons();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create coupon');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">Manage Coupons</h1>
          <p className="text-gray-500 text-sm mt-1">Create and manage marketing discount codes</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl text-sm shadow-md shadow-orange-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((coupon) => (
          <div
            key={coupon._id}
            className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden flex flex-col justify-between"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-mono font-black text-lg text-gray-900 tracking-wider">
                    {coupon.code}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {coupon.discountType === 'percentage'
                      ? `${coupon.discountValue}% OFF (Max ₹${coupon.maximumDiscount})`
                      : `Flat ₹${coupon.discountValue} OFF`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleDelete(coupon._id)}
                className="text-gray-400 hover:text-red-500 p-1 rounded-lg"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 border-t border-gray-100 text-xs text-gray-500 space-y-1">
              <p>Min Order Value: <span className="font-semibold text-gray-700">₹{coupon.minimumOrder}</span></p>
              <p>Valid Until: <span className="font-semibold text-gray-700">{new Date(coupon.expiryDate).toLocaleDateString()}</span></p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Create New Coupon</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Coupon Code</label>
                <input
                  type="text"
                  required
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value })}
                  placeholder="e.g. BITE50, YUMMY100"
                  className="w-full px-4 py-2 border rounded-xl text-sm uppercase font-mono"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Value</label>
                  <input
                    type="number"
                    required
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Min Order (₹)</label>
                  <input
                    type="number"
                    required
                    value={form.minimumOrder}
                    onChange={(e) => setForm({ ...form, minimumOrder: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Max Discount (₹)</label>
                  <input
                    type="number"
                    value={form.maximumDiscount}
                    onChange={(e) => setForm({ ...form, maximumDiscount: Number(e.target.value) })}
                    className="w-full px-4 py-2 border rounded-xl text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Expiry Date</label>
                <input
                  type="date"
                  required
                  value={form.expiryDate}
                  onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
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
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCoupons;
