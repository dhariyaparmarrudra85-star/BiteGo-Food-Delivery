import Restaurant from '../models/Restaurant.js';
import Food from '../models/Food.js';

// @desc    Get all restaurants (with filters)
// @route   GET /api/restaurants
// @access  Public
export const getRestaurants = async (req, res, next) => {
  try {
    const { search, cuisine, rating, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { cuisine: { $regex: search, $options: 'i' } },
        { 'address.city': { $regex: search, $options: 'i' } },
      ];
    }

    if (cuisine) {
      query.cuisine = { $in: cuisine.split(',').map((c) => new RegExp(c.trim(), 'i')) };
    }

    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Sort options
    let sortOption = { createdAt: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'deliveryTime') sortOption = { deliveryTime: 1 };
    else if (sort === 'priceForTwo') sortOption = { priceForTwo: 1 };
    else if (sort === 'popularity') sortOption = { totalRatings: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Restaurant.countDocuments(query);
    const restaurants = await Restaurant.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      restaurants,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single restaurant
// @route   GET /api/restaurants/:id
// @access  Public
export const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate('owner', 'name email');
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }
    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    next(error);
  }
};

// @desc    Create restaurant
// @route   POST /api/restaurants
// @access  Private (admin / restaurantOwner)
export const createRestaurant = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.files?.image) data.image = `/uploads/${req.files.image[0].filename}`;
    if (req.files?.logo) data.logo = `/uploads/${req.files.logo[0].filename}`;

    // Restaurant owners are automatically set as owner
    if (req.user.role === 'restaurantOwner') {
      data.owner = req.user._id;
    }

    const restaurant = await Restaurant.create(data);
    res.status(201).json({ success: true, message: 'Restaurant created successfully.', restaurant });
  } catch (error) {
    next(error);
  }
};

// @desc    Update restaurant
// @route   PUT /api/restaurants/:id
// @access  Private (admin / owner of restaurant)
export const updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    // Only admin or the restaurant's owner can update
    if (req.user.role !== 'admin' && restaurant.owner?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    const data = { ...req.body };
    if (req.files?.image) data.image = `/uploads/${req.files.image[0].filename}`;
    if (req.files?.logo) data.logo = `/uploads/${req.files.logo[0].filename}`;

    const updated = await Restaurant.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({ success: true, message: 'Restaurant updated.', restaurant: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete restaurant
// @route   DELETE /api/restaurants/:id
// @access  Private (admin only)
export const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    await Food.deleteMany({ restaurant: req.params.id });
    await restaurant.deleteOne();

    res.status(200).json({ success: true, message: 'Restaurant and associated food items deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get owner's restaurant
// @route   GET /api/restaurants/owner/mine
// @access  Private (restaurantOwner)
export const getOwnerRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'No restaurant found for your account.' });
    }
    res.status(200).json({ success: true, restaurant });
  } catch (error) {
    next(error);
  }
};
