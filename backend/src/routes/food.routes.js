import express from 'express';
import {
  getFoods,
  getFoodById,
  getFoodsByRestaurant,
  createFood,
  updateFood,
  deleteFood,
} from '../controllers/food.controller.js';
import { protect, restrictTo } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/', getFoods);
router.get('/restaurant/:restaurantId', getFoodsByRestaurant);
router.get('/:id', getFoodById);

router.post('/', protect, restrictTo('admin', 'restaurantOwner'), upload.single('image'), createFood);
router.put('/:id', protect, restrictTo('admin', 'restaurantOwner'), upload.single('image'), updateFood);
router.delete('/:id', protect, restrictTo('admin', 'restaurantOwner'), deleteFood);

export default router;
