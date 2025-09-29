import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  getUserStats,
  searchUsers
} from '../controllers/userController';
import { authenticate, requireAdmin, requireOwnershipOrAdmin } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authenticate);

// Public user routes (authenticated users)
router.get('/search', searchUsers);
router.get('/stats', requireAdmin, getUserStats);

// Admin only routes
router.get('/', requireAdmin, getAllUsers);
router.post('/', requireAdmin, createUser);
router.get('/:id', getUserById);
router.put('/:id', requireOwnershipOrAdmin('id'), updateUser);
router.delete('/:id', requireAdmin, deleteUser);
router.patch('/:id/status', requireAdmin, toggleUserStatus);

export default router;
