import express from 'express';
import { optionalAuth } from '../middleware/auth';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  mergeCart,
  getCartSummary,
  validateCart
} from '../controllers/cartController';

const router = express.Router();

// All cart routes use optional authentication (for guest users)
router.use(optionalAuth);

// Cart management routes
router.get('/', getCart);
router.get('/summary', getCartSummary);
router.post('/validate', validateCart);

// Cart item management
router.post('/items', addToCart);
router.put('/items', updateCartItem);
router.delete('/items', removeFromCart);

// Cart operations
router.delete('/clear', clearCart);
router.post('/merge', mergeCart);

export default router;
