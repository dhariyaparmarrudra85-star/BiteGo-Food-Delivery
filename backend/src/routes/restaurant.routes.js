import express from 'express';
import {
  getRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getOwnerRestaurant,
} from '../controllers/restaurant.controller.js';
import { getRestaurantReviews } from '../controllers/review.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getRestaurants);
router.get('/owner/mine', protect, restrictTo('restaurantOwner'), getOwnerRestaurant);
router.get('/:id', getRestaurantById);
router.get('/:id/reviews', getRestaurantReviews);

router.post(
  '/',
  protect,
  restrictTo('admin', 'restaurantOwner'),
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }]),
  createRestaurant
);
router.put(
  '/:id',
  protect,
  restrictTo('admin', 'restaurantOwner'),
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'logo', maxCount: 1 }]),
  updateRestaurant
);
router.delete('/:id', protect, restrictTo('admin'), deleteRestaurant);

export default router;
