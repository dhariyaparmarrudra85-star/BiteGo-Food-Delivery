import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private (admin)
export const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalRestaurants, totalOrders, revenueResult] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Restaurant.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { orderStatus: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } },
      ]),
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    // Recent orders
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'name email')
      .populate('restaurant', 'name');

    // Orders by status
    const ordersByStatus = await Order.aggregate([
      { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
    ]);

    // Revenue over last 7 days
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const dailyRevenue = await Order.aggregate([
      { $match: { createdAt: { $gte: last7Days }, orderStatus: 'delivered' } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalRestaurants,
        totalOrders,
        totalRevenue,
        recentOrders,
        ordersByStatus,
        dailyRevenue,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (admin)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:id/role
// @access  Private (admin)
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    const validRoles = ['user', 'admin', 'restaurantOwner'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role.' });
    }

    // Prevent self-demotion
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot change your own role.' });
    }

    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.status(200).json({ success: true, message: 'User role updated.', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (admin)
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account.' });
    }

    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

    res.status(200).json({ success: true, message: 'User deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private (admin)
export const getAllOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const query = status ? { orderStatus: status } : {};
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('user', 'name email phone')
      .populate('restaurant', 'name');

    res.status(200).json({ success: true, total, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all reviews (admin)
// @route   GET /api/admin/reviews
// @access  Private (admin)
export const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email')
      .populate('restaurant', 'name');

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};
