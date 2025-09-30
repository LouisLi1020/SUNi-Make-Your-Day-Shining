import { Request, Response, NextFunction } from 'express';
import { PaymentService, PaymentIntentData } from '../services/paymentService';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import mongoose from 'mongoose';

// Create payment intent
export const createPaymentIntent = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { amount, currency = 'TWD', orderId, description } = req.body;
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;

    // Validate required fields
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid amount is required'
      });
    }

    // Prepare payment intent data
    const paymentData: PaymentIntentData = {
      amount,
      currency,
      metadata: {
        orderId,
        userId,
        sessionId
      },
      customerEmail: req.user?.email,
      description: description || 'Suni Platform Purchase'
    };

    // Create payment intent
    const paymentResult = await PaymentService.createPaymentIntent(paymentData);

    res.json({
      success: true,
      data: {
        clientSecret: paymentResult.clientSecret,
        paymentIntentId: paymentResult.paymentIntentId,
        status: paymentResult.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get payment intent status
export const getPaymentStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentIntentId } = req.params;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    const paymentIntent = await PaymentService.getPaymentIntentStatus(paymentIntentId);

    res.json({
      success: true,
      data: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
        created: paymentIntent.created
      }
    });
  } catch (error) {
    next(error);
  }
};

// Confirm payment intent
export const confirmPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentIntentId } = req.params;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    const paymentIntent = await PaymentService.confirmPaymentIntent(paymentIntentId);

    res.json({
      success: true,
      data: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      }
    });
  } catch (error) {
    next(error);
  }
};

// Cancel payment intent
export const cancelPayment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentIntentId } = req.params;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    const paymentIntent = await PaymentService.cancelPaymentIntent(paymentIntentId);

    res.json({
      success: true,
      data: {
        id: paymentIntent.id,
        status: paymentIntent.status
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create refund
export const createRefund = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { paymentIntentId } = req.params;
    const { amount, reason } = req.body;

    if (!paymentIntentId) {
      return res.status(400).json({
        success: false,
        message: 'Payment intent ID is required'
      });
    }

    const refund = await PaymentService.createRefund(paymentIntentId, amount, reason);

    res.json({
      success: true,
      data: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
        reason: refund.reason
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get customer payment methods
export const getPaymentMethods = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // For now, we'll return empty array since we don't have Stripe customer IDs stored
    // In a real implementation, you'd store the Stripe customer ID in the user profile
    res.json({
      success: true,
      data: {
        paymentMethods: []
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create Stripe customer
export const createCustomer = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { email, name } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const customer = await PaymentService.createCustomer(
      email || req.user?.email || '',
      name || req.user?.name || '',
      { userId: userId }
    );

    res.json({
      success: true,
      data: {
        customerId: customer.id,
        email: customer.email,
        name: customer.name
      }
    });
  } catch (error) {
    next(error);
  }
};

// Handle Stripe webhooks
export const handleWebhook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const signature = req.headers['stripe-signature'] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      throw new AppError('Webhook secret not configured', 500);
    }

    // Verify webhook signature
    const event = PaymentService.verifyWebhookSignature(
      JSON.stringify(req.body),
      signature,
      webhookSecret
    );

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await PaymentService.handleSuccessfulPayment(event.data.object as any);
        break;
      
      case 'payment_intent.payment_failed':
        await PaymentService.handleFailedPayment(event.data.object as any);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(400).json({ error: 'Webhook signature verification failed' });
  }
};
