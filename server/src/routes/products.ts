import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  getFeaturedProducts,
  searchProducts,
  updateInventory,
  getProductStats
} from '../controllers/productController';
import { authenticate, requireAdmin, requireOwnershipOrAdmin } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.get('/', getProducts);
router.get('/search', searchProducts);
router.get('/featured', getFeaturedProducts);
router.get('/categories', getCategories);
router.get('/stats', getProductStats);
router.get('/:id', getProduct);

// Protected routes (require authentication)
router.use(authenticate);

// Admin only routes
router.post('/', requireAdmin, createProduct);
router.put('/:id', requireAdmin, updateProduct);
router.delete('/:id', requireAdmin, deleteProduct);
router.patch('/:id/inventory', requireAdmin, updateInventory);

export default router;
