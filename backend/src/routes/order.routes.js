import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getRestaurantOrders,
} from '../controllers/order.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect);

router.post('/', createOrder);
router.get('/', getUserOrders);
router.get('/restaurant', restrictTo('restaurantOwner', 'admin'), getRestaurantOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', restrictTo('admin', 'restaurantOwner'), updateOrderStatus);
router.delete('/:id', cancelOrder);

export default router;
