import Food from '../models/Food.js';
import Restaurant from '../models/Restaurant.js';

// @desc    Get all foods (with search and filters)
// @route   GET /api/foods
// @access  Public
export const getFoods = async (req, res, next) => {
  try {
    const { search, category, restaurant, isVeg, sort, page = 1, limit = 20 } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) query.category = { $regex: category, $options: 'i' };
    if (restaurant) query.restaurant = restaurant;
    if (isVeg !== undefined) query.isVeg = isVeg === 'true';

    query.isAvailable = true;

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Food.countDocuments(query);
    const foods = await Food.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit))
      .populate('restaurant', 'name image deliveryTime');

    res.status(200).json({ success: true, total, foods });
  } catch (error) {
    next(error);
  }
};

// @desc    Get food by ID
// @route   GET /api/foods/:id
// @access  Public
export const getFoodById = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id).populate('restaurant', 'name image cuisine');
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }
    res.status(200).json({ success: true, food });
  } catch (error) {
    next(error);
  }
};

// @desc    Get foods for a specific restaurant
// @route   GET /api/foods/restaurant/:restaurantId
// @access  Public
export const getFoodsByRestaurant = async (req, res, next) => {
  try {
    const foods = await Food.find({ restaurant: req.params.restaurantId, isAvailable: true });
    res.status(200).json({ success: true, foods });
  } catch (error) {
    next(error);
  }
};

// @desc    Create food item
// @route   POST /api/foods
// @access  Private (admin / restaurantOwner)
export const createFood = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;

    // Ensure restaurant owners can only add to their own restaurant
    if (req.user.role === 'restaurantOwner') {
      const restaurant = await Restaurant.findOne({ owner: req.user._id });
      if (!restaurant) {
        return res.status(404).json({ success: false, message: 'No restaurant found for your account.' });
      }
      data.restaurant = restaurant._id;
    }

    const food = await Food.create(data);
    res.status(201).json({ success: true, message: 'Food item created.', food });
  } catch (error) {
    next(error);
  }
};

// @desc    Update food item
// @route   PUT /api/foods/:id
// @access  Private (admin / restaurantOwner)
export const updateFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id).populate('restaurant');
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }

    // Restaurant owner can only update their own food
    if (req.user.role === 'restaurantOwner') {
      if (food.restaurant.owner?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to update this food item.' });
      }
    }

    const data = { ...req.body };
    if (req.file) data.image = `/uploads/${req.file.filename}`;

    const updated = await Food.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.status(200).json({ success: true, message: 'Food item updated.', food: updated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete food item
// @route   DELETE /api/foods/:id
// @access  Private (admin / restaurantOwner)
export const deleteFood = async (req, res, next) => {
  try {
    const food = await Food.findById(req.params.id).populate('restaurant');
    if (!food) {
      return res.status(404).json({ success: false, message: 'Food item not found.' });
    }

    if (req.user.role === 'restaurantOwner') {
      if (food.restaurant.owner?.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized to delete this food item.' });
      }
    }

    await food.deleteOne();
    res.status(200).json({ success: true, message: 'Food item deleted.' });
  } catch (error) {
    next(error);
  }
};
