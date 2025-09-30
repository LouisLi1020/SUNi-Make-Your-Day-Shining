import express from 'express';
import { authenticate } from '../middleware/auth';
import {
  createPaymentIntent,
  getPaymentStatus,
  confirmPayment,
  cancelPayment,
  createRefund,
  getPaymentMethods,
  createCustomer,
  handleWebhook
} from '../controllers/paymentController';

const router = express.Router();

// Webhook endpoint (no authentication required)
router.post('/webhook', handleWebhook);

// Payment intent routes
router.post('/create-intent', authenticate, createPaymentIntent);
router.get('/status/:paymentIntentId', getPaymentStatus);
router.post('/confirm/:paymentIntentId', confirmPayment);
router.post('/cancel/:paymentIntentId', cancelPayment);

// Refund routes
router.post('/refund/:paymentIntentId', createRefund);

// Customer management routes
router.get('/methods', authenticate, getPaymentMethods);
router.post('/customer', authenticate, createCustomer);

export default router;
