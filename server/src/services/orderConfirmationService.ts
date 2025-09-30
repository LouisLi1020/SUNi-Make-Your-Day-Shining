import { Order, OrderStatus, PaymentStatus, IOrder } from '../models/Order';
import { User, IUser } from '../models/User';
import { Product, IProduct } from '../models/Product';
import mongoose from 'mongoose';
import { AppError } from '../middleware/errorHandler';

export interface OrderConfirmationData {
  orderId: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
    variant?: any;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  shippingAddress: any;
  billingAddress: any;
  paymentMethod: string;
  orderDate: Date;
  estimatedDelivery?: Date;
}

export interface OrderStatusUpdate {
  orderId: string;
  status: OrderStatus;
  paymentStatus?: PaymentStatus;
  trackingNumber?: string;
  notes?: string;
  updatedBy?: string;
}

export class OrderConfirmationService {
  /**
   * Generate order confirmation data
   */
  static async generateOrderConfirmation(orderId: string): Promise<OrderConfirmationData> {
    try {
      const order = await Order.findById(orderId)
        .populate('user', 'name email')
        .populate('items.product', 'name sku');

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      const populatedOrder = order as unknown as IOrder & { user: IUser };

      const orderConfirmation: OrderConfirmationData = {
        orderId: (order._id as mongoose.Types.ObjectId).toString(),
        orderNumber: order.orderNumber,
        customerEmail: populatedOrder.user?.email || '',
        customerName: populatedOrder.user?.name || '',
        items: order.items.map(item => ({
          name: (item.product as unknown as IProduct).name,
          quantity: item.quantity,
          price: item.price,
          total: item.total,
          variant: item.variant
        })),
        subtotal: order.pricing.subtotal,
        tax: order.pricing.tax,
        shipping: order.pricing.shipping,
        discount: order.pricing.discount,
        total: order.pricing.total,
        currency: order.pricing.currency,
        shippingAddress: order.shipping.address,
        billingAddress: order.billing.address,
        paymentMethod: order.payment.method,
        orderDate: order.createdAt,
        estimatedDelivery: this.calculateEstimatedDelivery(order.createdAt, order.shipping.method)
      };

      return orderConfirmation;
    } catch (error) {
      console.error('Failed to generate order confirmation:', error);
      throw new AppError('Failed to generate order confirmation', 500);
    }
  }

  /**
   * Send order confirmation email
   */
  static async sendOrderConfirmationEmail(orderId: string): Promise<boolean> {
    try {
      const orderData = await this.generateOrderConfirmation(orderId);
      
      // TODO: Implement actual email sending service (SendGrid, etc.)
      console.log('📧 Order confirmation email would be sent to:', orderData.customerEmail);
      console.log('📦 Order details:', {
        orderNumber: orderData.orderNumber,
        total: orderData.total,
        currency: orderData.currency,
        itemCount: orderData.items.length
      });

      // For now, just log the email content
      this.logOrderConfirmationEmail(orderData);
      
      return true;
    } catch (error) {
      console.error('Failed to send order confirmation email:', error);
      return false;
    }
  }

  /**
   * Update order status
   */
  static async updateOrderStatus(updateData: OrderStatusUpdate): Promise<IOrder> {
    try {
      const { orderId, status, paymentStatus, trackingNumber, notes, updatedBy } = updateData;

      const updateFields: any = {
        status,
        updatedAt: new Date()
      };

      if (paymentStatus) {
        updateFields['payment.status'] = paymentStatus;
      }

      if (trackingNumber) {
        updateFields.trackingNumber = trackingNumber;
      }

      if (notes) {
        updateFields.notes = notes;
      }

      if (updatedBy) {
        updateFields.updatedBy = new mongoose.Types.ObjectId(updatedBy);
      }

      const order = await Order.findByIdAndUpdate(
        orderId,
        updateFields,
        { new: true, runValidators: true }
      ).populate('user', 'name email');

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      // Send status update notification if needed
      if (this.shouldSendStatusNotification(status)) {
        await this.sendStatusUpdateNotification(order);
      }

      return order;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw new AppError('Failed to update order status', 500);
    }
  }

  /**
   * Get order tracking information
   */
  static async getOrderTracking(orderId: string): Promise<any> {
    try {
      const order = await Order.findById(orderId)
        .populate('user', 'name email')
        .select('orderNumber status payment trackingNumber shippingAddress createdAt updatedAt');

      if (!order) {
        throw new AppError('Order not found', 404);
      }

      const trackingInfo = {
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.payment.status,
        trackingNumber: order.shipping.trackingNumber,
        orderDate: order.createdAt,
        lastUpdated: order.updatedAt,
        estimatedDelivery: this.calculateEstimatedDelivery(order.createdAt, order.shipping.method),
        shippingAddress: order.shipping.address,
        statusHistory: await this.getOrderStatusHistory(orderId)
      };

      return trackingInfo;
    } catch (error) {
      console.error('Failed to get order tracking:', error);
      throw new AppError('Failed to get order tracking information', 500);
    }
  }

  /**
   * Get order history for a user
   */
  static async getUserOrderHistory(userId: string, page: number = 1, limit: number = 10): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const orders = await Order.find({ user: userId })
        .populate('items.product', 'name sku images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('orderNumber status payment total currency createdAt');

      const totalOrders = await Order.countDocuments({ user: userId });

      return {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalOrders / limit),
          totalOrders,
          hasNextPage: page < Math.ceil(totalOrders / limit),
          hasPrevPage: page > 1
        }
      };
    } catch (error) {
      console.error('Failed to get user order history:', error);
      throw new AppError('Failed to get order history', 500);
    }
  }

  /**
   * Calculate estimated delivery date
   */
  private static calculateEstimatedDelivery(orderDate: Date, shippingMethod?: string): Date {
    const deliveryDays = this.getDeliveryDays(shippingMethod);
    const estimatedDelivery = new Date(orderDate);
    estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);
    return estimatedDelivery;
  }

  /**
   * Get delivery days based on shipping method
   */
  private static getDeliveryDays(shippingMethod?: string): number {
    switch (shippingMethod) {
      case 'express':
        return 1;
      case 'standard':
        return 3;
      case 'economy':
        return 7;
      default:
        return 5;
    }
  }

  /**
   * Check if status update notification should be sent
   */
  private static shouldSendStatusNotification(status: OrderStatus): boolean {
    const notificationStatuses = [
      OrderStatus.CONFIRMED,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.CANCELLED
    ];
    return notificationStatuses.includes(status);
  }

  /**
   * Send status update notification
   */
  private static async sendStatusUpdateNotification(order: any): Promise<void> {
    try {
      // TODO: Implement actual notification service
      console.log(`📱 Status update notification for order ${order.orderNumber}: ${order.status}`);
    } catch (error) {
      console.error('Failed to send status update notification:', error);
    }
  }

  /**
   * Get order status history
   */
  private static async getOrderStatusHistory(orderId: string): Promise<any[]> {
    try {
      // TODO: Implement order status history tracking
      // For now, return a simple status history
      return [
        {
          status: 'pending',
          timestamp: new Date(),
          note: 'Order created'
        }
      ];
    } catch (error) {
      console.error('Failed to get order status history:', error);
      return [];
    }
  }

  /**
   * Log order confirmation email content (for development)
   */
  private static logOrderConfirmationEmail(orderData: OrderConfirmationData): void {
    console.log('\n📧 ORDER CONFIRMATION EMAIL');
    console.log('=====================================');
    console.log(`To: ${orderData.customerEmail}`);
    console.log(`Subject: Order Confirmation - ${orderData.orderNumber}`);
    console.log('\nOrder Details:');
    console.log(`Order Number: ${orderData.orderNumber}`);
    console.log(`Order Date: ${orderData.orderDate.toLocaleDateString()}`);
    console.log(`Total: ${orderData.currency} ${orderData.total}`);
    console.log('\nItems:');
    orderData.items.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} x${item.quantity} - ${orderData.currency} ${item.total}`);
    });
    console.log('\nShipping Address:');
    console.log(`${orderData.shippingAddress.firstName} ${orderData.shippingAddress.lastName}`);
    console.log(`${orderData.shippingAddress.address1}`);
    if (orderData.shippingAddress.address2) {
      console.log(`${orderData.shippingAddress.address2}`);
    }
    console.log(`${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}`);
    console.log(`${orderData.shippingAddress.country}`);
    console.log('=====================================\n');
  }
}

export default OrderConfirmationService;
