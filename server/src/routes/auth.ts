import { Router } from 'express';
import {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  refreshToken
} from '../controllers/authController';
import { authenticate, authRateLimit } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', authRateLimit(3, 15 * 60 * 1000), register); // 3 attempts per 15 minutes
router.post('/login', authRateLimit(5, 15 * 60 * 1000), login); // 5 attempts per 15 minutes
router.post('/forgot-password', authRateLimit(3, 60 * 60 * 1000), forgotPassword); // 3 attempts per hour
router.post('/reset-password', authRateLimit(3, 15 * 60 * 1000), resetPassword); // 3 attempts per 15 minutes
router.post('/refresh-token', refreshToken);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.post('/logout', logout);
router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);

export default router;
