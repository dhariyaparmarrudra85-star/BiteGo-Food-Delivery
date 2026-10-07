import Coupon from '../models/Coupon.js';

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private (admin)
export const getCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, coupons });
  } catch (error) {
    next(error);
  }
};

// @desc    Create coupon
// @route   POST /api/coupons
// @access  Private (admin)
export const createCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({ success: true, message: 'Coupon created.', coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private (admin)
export const updateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.status(200).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private (admin)
export const deleteCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found.' });
    res.status(200).json({ success: true, message: 'Coupon deleted.' });
  } catch (error) {
    next(error);
  }
};

// @desc    Validate coupon (public check)
// @route   GET /api/coupons/validate/:code
// @access  Private
export const validateCoupon = async (req, res, next) => {
  try {
    const coupon = await Coupon.findOne({
      code: req.params.code.toUpperCase(),
      isActive: true,
      expiryDate: { $gte: new Date() },
    });

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or expired coupon.' });
    }

    res.status(200).json({ success: true, coupon });
  } catch (error) {
    next(error);
  }
};
