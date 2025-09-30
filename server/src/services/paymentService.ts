import Stripe from 'stripe';
import { AppError } from '../middleware/errorHandler';

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2023-10-16',
});

export interface PaymentIntentData {
  amount: number;
  currency: string;
  metadata?: {
    orderId?: string;
    userId?: string;
    sessionId?: string;
  };
  customerEmail?: string;
  description?: string;
}

export interface PaymentResult {
  clientSecret: string;
  paymentIntentId: string;
  status: string;
}

export class PaymentService {
  /**
   * Create a payment intent for checkout
   */
  static async createPaymentIntent(data: PaymentIntentData): Promise<PaymentResult> {
    try {
      // Convert amount to cents (Stripe uses smallest currency unit)
      const amountInCents = Math.round(data.amount * 100);

      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency: data.currency.toLowerCase(),
        metadata: data.metadata || {},
        receipt_email: data.customerEmail,
        description: data.description || 'Suni Platform Purchase',
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret!,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status,
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      throw new AppError('Payment processing failed', 500);
    }
  }

  /**
   * Retrieve payment intent status
   */
  static async getPaymentIntentStatus(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Failed to retrieve payment intent:', error);
      throw new AppError('Payment verification failed', 500);
    }
  }

  /**
   * Confirm payment intent
   */
  static async confirmPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Failed to confirm payment intent:', error);
      throw new AppError('Payment confirmation failed', 500);
    }
  }

  /**
   * Cancel payment intent
   */
  static async cancelPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    try {
      const paymentIntent = await stripe.paymentIntents.cancel(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      console.error('Failed to cancel payment intent:', error);
      throw new AppError('Payment cancellation failed', 500);
    }
  }

  /**
   * Create a refund
   */
  static async createRefund(paymentIntentId: string, amount?: number, reason?: string): Promise<Stripe.Refund> {
    try {
      const refundData: Stripe.RefundCreateParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundData.amount = Math.round(amount * 100); // Convert to cents
      }

      if (reason) {
        refundData.reason = reason as Stripe.RefundCreateParams.Reason;
      }

      const refund = await stripe.refunds.create(refundData);
      return refund;
    } catch (error) {
      console.error('Failed to create refund:', error);
      throw new AppError('Refund processing failed', 500);
    }
  }

  /**
   * Get payment methods for a customer
   */
  static async getCustomerPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });
      return paymentMethods.data;
    } catch (error) {
      console.error('Failed to retrieve customer payment methods:', error);
      throw new AppError('Failed to retrieve payment methods', 500);
    }
  }

  /**
   * Create a customer in Stripe
   */
  static async createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<Stripe.Customer> {
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: metadata || {},
      });
      return customer;
    } catch (error) {
      console.error('Failed to create Stripe customer:', error);
      throw new AppError('Customer creation failed', 500);
    }
  }

  /**
   * Verify webhook signature
   */
  static verifyWebhookSignature(payload: string, signature: string, secret: string): Stripe.Event {
    try {
      return stripe.webhooks.constructEvent(payload, signature, secret);
    } catch (error) {
      console.error('Webhook signature verification failed:', error);
      throw new AppError('Invalid webhook signature', 400);
    }
  }

  /**
   * Handle successful payment webhook
   */
  static async handleSuccessfulPayment(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      const { orderId } = paymentIntent.metadata;
      
      if (orderId) {
        // Update order status in database
        // This would typically update the order status to 'paid'
        console.log(`Payment successful for order: ${orderId}`);
        // TODO: Update order status in database
      }
    } catch (error) {
      console.error('Failed to handle successful payment:', error);
      throw error;
    }
  }

  /**
   * Handle failed payment webhook
   */
  static async handleFailedPayment(paymentIntent: Stripe.PaymentIntent): Promise<void> {
    try {
      const { orderId } = paymentIntent.metadata;
      
      if (orderId) {
        // Update order status in database
        // This would typically update the order status to 'payment_failed'
        console.log(`Payment failed for order: ${orderId}`);
        // TODO: Update order status in database
      }
    } catch (error) {
      console.error('Failed to handle failed payment:', error);
      throw error;
    }
  }
}

export default PaymentService;
