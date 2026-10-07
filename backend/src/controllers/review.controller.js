import Review from '../models/Review.js';
import Restaurant from '../models/Restaurant.js';
import Order from '../models/Order.js';

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req, res, next) => {
  try {
    const { restaurantId, orderId, rating, comment } = req.body;

    // Verify the order belongs to this user and is delivered
    const order = await Order.findById(orderId);
    if (!order || order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Invalid order.' });
    }
    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({ success: false, message: 'You can only review after delivery.' });
    }

    // Check for duplicate review
    const existing = await Review.findOne({ user: req.user._id, restaurant: restaurantId, order: orderId });
    if (existing) {
      return res.status(409).json({ success: false, message: 'You have already reviewed this order.' });
    }

    const review = await Review.create({
      user: req.user._id,
      restaurant: restaurantId,
      order: orderId,
      rating,
      comment,
    });

    // Update restaurant average rating
    const reviews = await Review.find({ restaurant: restaurantId });
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Restaurant.findByIdAndUpdate(restaurantId, {
      rating: Math.round(avgRating * 10) / 10,
      totalRatings: reviews.length,
    });

    const populated = await Review.findById(review._id).populate('user', 'name profileImage');
    res.status(201).json({ success: true, message: 'Review submitted!', review: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get reviews for a restaurant
// @route   GET /api/restaurants/:id/reviews
// @access  Public
export const getRestaurantReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ restaurant: req.params.id })
      .sort({ createdAt: -1 })
      .populate('user', 'name profileImage');

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};
