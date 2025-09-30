import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  getOrderConfirmation,
  sendOrderConfirmationEmail,
  updateOrderStatus,
  getOrderTracking,
  getUserOrderHistory,
  getOrderByNumber,
  cancelOrder,
  getOrderStatistics
} from '../controllers/orderConfirmationController';

const router = express.Router();

// Public routes (no authentication required)
router.get('/track/:orderNumber', getOrderByNumber);

// Protected routes (authentication required)
router.get('/confirmation/:orderId', authenticate, getOrderConfirmation);
router.post('/confirmation/:orderId/email', authenticate, sendOrderConfirmationEmail);
router.get('/tracking/:orderId', getOrderTracking);
router.get('/history', authenticate, getUserOrderHistory);
router.post('/:orderId/cancel', authenticate, cancelOrder);

// Admin routes (authentication + admin role required)
router.put('/:orderId/status', authenticate, updateOrderStatus);
router.get('/statistics', authenticate, getOrderStatistics);

export default router;
