import express from 'express';
import {
  getProfile,
  updateProfile,
  toggleFavorite,
  getFavorites,
  changePassword,
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../middleware/upload.middleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.put('/profile', protect, upload.single('profileImage'), updateProfile);
router.get('/favorites', protect, getFavorites);
router.post('/favorites/:restaurantId', protect, toggleFavorite);
router.put('/change-password', protect, changePassword);

export default router;
