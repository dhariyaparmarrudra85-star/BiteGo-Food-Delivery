import express from 'express';
import {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getAllOrders,
  getAllReviews,
} from '../controllers/admin.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';

const router = express.Router();

// All admin routes require login + admin role
router.use(protect, restrictTo('admin'));

router.get('/stats', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);
router.get('/orders', getAllOrders);
router.get('/reviews', getAllReviews);

export default router;
