import User from '../models/User.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (address) updateData.address = address;

    if (req.file) {
      updateData.profileImage = `/uploads/${req.file.filename}`;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Profile updated successfully.', user });
  } catch (error) {
    next(error);
  }
};

// @desc    Add/remove restaurant from favorites
// @route   POST /api/users/favorites/:restaurantId
// @access  Private
export const toggleFavorite = async (req, res, next) => {
  try {
    const { restaurantId } = req.params;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    const user = await User.findById(req.user._id);
    const isFavorite = user.favorites.includes(restaurantId);

    if (isFavorite) {
      user.favorites = user.favorites.filter((id) => id.toString() !== restaurantId);
    } else {
      user.favorites.push(restaurantId);
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: isFavorite ? 'Removed from favorites.' : 'Added to favorites.',
      isFavorite: !isFavorite,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's favorite restaurants
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// @desc    Change password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    next(error);
  }
};
