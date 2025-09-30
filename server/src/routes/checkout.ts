import express from 'express';
import { optionalAuth } from '../middleware/auth';
import {
  initializeCheckout,
  processCheckout,
  getCheckoutSession,
  updateShippingMethod,
  applyDiscountCode
} from '../controllers/checkoutController';

const router = express.Router();

// All checkout routes use optional authentication (for guest users)
router.use(optionalAuth);

// Checkout flow routes
router.get('/session', getCheckoutSession);
router.post('/initialize', initializeCheckout);
router.post('/process', processCheckout);

// Checkout customization
router.put('/shipping', updateShippingMethod);
router.post('/discount', applyDiscountCode);

export default router;
