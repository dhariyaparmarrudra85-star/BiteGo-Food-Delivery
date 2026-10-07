import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  applyCoupon,
} from '../controllers/cart.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect); // All cart routes require authentication

router.get('/', getCart);
router.post('/', addToCart);
router.post('/coupon', applyCoupon);
router.put('/:itemId', updateCartItem);
router.delete('/', clearCart);
router.delete('/:itemId', removeFromCart);

export default router;
