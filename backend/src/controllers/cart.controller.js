import Cart from '../models/Cart.js';
import Food from '../models/Food.js';
import Coupon from '../models/Coupon.js';

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate('items.food', 'name image price isVeg isAvailable')
      .populate('restaurant', 'name image deliveryFee')
      .populate('coupon', 'code discountType discountValue');

    if (!cart) {
      return res.status(200).json({ success: true, cart: null });
    }
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to cart (or create cart)
// @route   POST /api/cart
// @access  Private
export const addToCart = async (req, res, next) => {
  try {
    const { foodId, quantity = 1 } = req.body;

    const food = await Food.findById(foodId);
    if (!food || !food.isAvailable) {
      return res.status(404).json({ success: false, message: 'Food item not found or unavailable.' });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      // Prevent adding from a different restaurant without confirming
      if (cart.restaurant && cart.restaurant.toString() !== food.restaurant.toString() && cart.items.length > 0) {
        return res.status(409).json({
          success: false,
          message: 'Your cart has items from another restaurant. Clear cart to continue.',
          conflict: true,
        });
      }

      // Check if item already in cart
      const existingItem = cart.items.find((item) => item.food.toString() === foodId);
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ food: foodId, quantity, price: food.price, name: food.name, image: food.image });
      }
      cart.restaurant = food.restaurant;
    } else {
      cart = new Cart({
        user: req.user._id,
        restaurant: food.restaurant,
        items: [{ food: foodId, quantity, price: food.price, name: food.name, image: food.image }],
      });
    }

    await cart.save();
    const populated = await Cart.findById(cart._id)
      .populate('items.food', 'name image price isVeg')
      .populate('restaurant', 'name image deliveryFee');

    res.status(200).json({ success: true, message: 'Added to cart.', cart: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:itemId
// @access  Private
export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found in cart.' });

    if (quantity <= 0) {
      item.deleteOne();
      if (cart.items.length === 0) {
        cart.restaurant = null;
        cart.coupon = null;
        cart.discount = 0;
      }
    } else {
      item.quantity = quantity;
    }

    await cart.save();
    const populated = await Cart.findById(cart._id)
      .populate('items.food', 'name image price isVeg')
      .populate('restaurant', 'name image deliveryFee');

    res.status(200).json({ success: true, cart: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:itemId
// @access  Private
export const removeFromCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const item = cart.items.id(req.params.itemId);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found.' });

    item.deleteOne();

    if (cart.items.length === 0) {
      cart.restaurant = null;
      cart.coupon = null;
      cart.discount = 0;
    }

    await cart.save();
    res.status(200).json({ success: true, message: 'Item removed from cart.', cart });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear entire cart
// @route   DELETE /api/cart
// @access  Private
export const clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], restaurant: null, coupon: null, discount: 0 }
    );
    res.status(200).json({ success: true, message: 'Cart cleared.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply coupon
// @route   POST /api/cart/coupon
// @access  Private
export const applyCoupon = async (req, res, next) => {
  try {
    const { code } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon code.' });
    }

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({ success: false, message: 'This coupon has expired.' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

    const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (subtotal < coupon.minimumOrder) {
      return res.status(400).json({
        success: false,
        message: `Minimum order of ₹${coupon.minimumOrder} required for this coupon.`,
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.discountValue) / 100;
      if (coupon.maximumDiscount) discount = Math.min(discount, coupon.maximumDiscount);
    } else {
      discount = coupon.discountValue;
    }

    cart.coupon = coupon._id;
    cart.discount = discount;
    await cart.save();

    res.status(200).json({
      success: true,
      message: `Coupon applied! You save ₹${discount.toFixed(2)}.`,
      discount,
    });
  } catch (error) {
    next(error);
  }
};
