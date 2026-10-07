import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Restaurant from '../models/Restaurant.js';

const TAX_RATE = 0.05; // 5% tax

// @desc    Create a new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res, next) => {
  try {
    const { deliveryAddress, paymentMethod, notes } = req.body;

    const cart = await Cart.findOne({ user: req.user._id }).populate('items.food');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cart is empty.' });
    }

    const restaurant = await Restaurant.findById(cart.restaurant);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found.' });
    }

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = restaurant.deliveryFee || 30;
    const tax = parseFloat((subtotal * TAX_RATE).toFixed(2));
    const discount = cart.discount || 0;
    const totalAmount = parseFloat((subtotal + deliveryFee + tax - discount).toFixed(2));

    const orderItems = cart.items.map((item) => ({
      food: item.food._id,
      name: item.food.name,
      image: item.food.image,
      price: item.price,
      quantity: item.quantity,
      isVeg: item.food.isVeg,
    }));

    const order = await Order.create({
      user: req.user._id,
      restaurant: cart.restaurant,
      items: orderItems,
      deliveryAddress,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      discount,
      totalAmount,
      estimatedDeliveryTime: restaurant.deliveryTime || 30,
      notes,
      statusTimeline: [{ status: 'pending', message: 'Order placed successfully!' }],
    });

    // Clear cart after order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], restaurant: null, coupon: null, discount: 0 }
    );

    const populated = await Order.findById(order._id)
      .populate('restaurant', 'name image address')
      .populate('user', 'name email phone');

    res.status(201).json({ success: true, message: 'Order placed successfully!', order: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all orders for logged-in user
// @route   GET /api/orders
// @access  Private
export const getUserOrders = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Order.countDocuments({ user: req.user._id });

    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('restaurant', 'name image');

    res.status(200).json({ success: true, total, orders });
  } catch (error) {
    next(error);
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('restaurant', 'name image address deliveryTime')
      .populate('user', 'name email phone');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found.' });
    }

    // Users can only see their own orders (admins and restaurant owners can see all)
    if (
      req.user.role === 'user' &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (admin / restaurantOwner)
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, message } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    // Restaurant owners can only update orders for their restaurant
    if (req.user.role === 'restaurantOwner') {
      const restaurant = await Restaurant.findOne({ owner: req.user._id });
      if (!restaurant || restaurant._id.toString() !== order.restaurant.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized.' });
      }
    }

    order.orderStatus = status;
    order.statusTimeline.push({ status, message: message || `Order ${status}` });

    if (status === 'delivered') {
      order.paymentStatus = 'paid';
    }

    await order.save();
    res.status(200).json({ success: true, message: 'Order status updated.', order });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel order (user can cancel if pending)
// @route   DELETE /api/orders/:id
// @access  Private
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ success: false, message: 'Order not found.' });

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized.' });
    }

    if (!['pending', 'confirmed'].includes(order.orderStatus)) {
      return res.status(400).json({ success: false, message: 'Order cannot be cancelled at this stage.' });
    }

    order.orderStatus = 'cancelled';
    order.statusTimeline.push({ status: 'cancelled', message: 'Order cancelled by user.' });
    await order.save();

    res.status(200).json({ success: true, message: 'Order cancelled.', order });
  } catch (error) {
    next(error);
  }
};

// @desc    Get orders for a restaurant (owner)
// @route   GET /api/orders/restaurant
// @access  Private (restaurantOwner)
export const getRestaurantOrders = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) return res.status(404).json({ success: false, message: 'Restaurant not found.' });

    const orders = await Order.find({ restaurant: restaurant._id })
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};
