import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  validateProfileUpdate,
  validatePreferences,
  validateAvatarUpload,
  validateAccountDeletion
} from '../middleware/profileValidation';
import {
  getProfile,
  updateProfile,
  getActivityHistory,
  getUserStats,
  uploadProfilePicture,
  deleteAccount,
  getPreferences,
  updatePreferences
} from '../controllers/profileController';

const router = express.Router();

// All profile routes require authentication
router.use(authenticate);

// Profile management routes
router.get('/', getProfile);
router.put('/', validateProfileUpdate, updateProfile);
router.delete('/', validateAccountDeletion, deleteAccount);

// Activity and statistics
router.get('/activity', getActivityHistory);
router.get('/stats', getUserStats);

// Preferences
router.get('/preferences', getPreferences);
router.put('/preferences', validatePreferences, updatePreferences);

// Profile picture
router.post('/avatar', validateAvatarUpload, uploadProfilePicture);

export default router;
