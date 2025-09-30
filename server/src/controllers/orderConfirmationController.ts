import { Request, Response, NextFunction } from 'express';
import { OrderConfirmationService, OrderStatusUpdate } from '../services/orderConfirmationService';
import { AuthenticatedRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { OrderStatus } from '../models/Order';

// Get order confirmation details
export const getOrderConfirmation = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const orderConfirmation = await OrderConfirmationService.generateOrderConfirmation(orderId);

    // Verify user has access to this order
    if (userId && orderConfirmation.customerEmail !== req.user?.email) {
      return res.status(403).json({
        success: false,
        message: 'Access denied to this order'
      });
    }

    res.json({
      success: true,
      data: orderConfirmation
    });
  } catch (error) {
    next(error);
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const emailSent = await OrderConfirmationService.sendOrderConfirmationEmail(orderId);

    if (emailSent) {
      res.json({
        success: true,
        message: 'Order confirmation email sent successfully'
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send order confirmation email'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Update order status
export const updateOrderStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const { status, paymentStatus, trackingNumber, notes } = req.body;
    const updatedBy = req.user?.id;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    if (!status || !Object.values(OrderStatus).includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid order status is required'
      });
    }

    const updateData: OrderStatusUpdate = {
      orderId,
      status,
      paymentStatus,
      trackingNumber,
      notes,
      updatedBy
    };

    const updatedOrder = await OrderConfirmationService.updateOrderStatus(updateData);

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: {
        orderId: updatedOrder._id,
        orderNumber: updatedOrder.orderNumber,
        status: updatedOrder.status,
        paymentStatus: updatedOrder.payment.status,
        trackingNumber: updatedOrder.shipping.trackingNumber,
        updatedAt: updatedOrder.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get order tracking information
export const getOrderTracking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    const trackingInfo = await OrderConfirmationService.getOrderTracking(orderId);

    res.json({
      success: true,
      data: trackingInfo
    });
  } catch (error) {
    next(error);
  }
};

// Get user order history
export const getUserOrderHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const orderHistory = await OrderConfirmationService.getUserOrderHistory(userId, page, limit);

    res.json({
      success: true,
      data: orderHistory
    });
  } catch (error) {
    next(error);
  }
};

// Get order by order number (public endpoint for tracking)
export const getOrderByNumber = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { orderNumber } = req.params;
    const { email } = req.query;

    if (!orderNumber) {
      return res.status(400).json({
        success: false,
        message: 'Order number is required'
      });
    }

    // Basic tracking info without sensitive data
    const trackingInfo = await OrderConfirmationService.getOrderTracking(orderNumber);

    // Verify email if provided (for additional security)
    if (email && trackingInfo.customerEmail !== email) {
      return res.status(403).json({
        success: false,
        message: 'Order not found or access denied'
      });
    }

    // Return only public tracking information
    const publicTrackingInfo = {
      orderNumber: trackingInfo.orderNumber,
      status: trackingInfo.status,
      trackingNumber: trackingInfo.trackingNumber,
      orderDate: trackingInfo.orderDate,
      lastUpdated: trackingInfo.lastUpdated,
      estimatedDelivery: trackingInfo.estimatedDelivery,
      statusHistory: trackingInfo.statusHistory
    };

    res.json({
      success: true,
      data: publicTrackingInfo
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order
export const cancelOrder = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { orderId } = req.params;
    const { reason } = req.body;
    const userId = req.user?.id;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: 'Order ID is required'
      });
    }

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const updateData: OrderStatusUpdate = {
      orderId,
      status: OrderStatus.CANCELLED,
      notes: reason || 'Order cancelled by customer',
      updatedBy: userId
    };

    const cancelledOrder = await OrderConfirmationService.updateOrderStatus(updateData);

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: {
        orderId: cancelledOrder._id,
        orderNumber: cancelledOrder.orderNumber,
        status: cancelledOrder.status,
        cancelledAt: cancelledOrder.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get order statistics (admin only)
export const getOrderStatistics = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // TODO: Add admin role check
    // For now, return basic statistics
    const stats = {
      totalOrders: 0,
      pendingOrders: 0,
      completedOrders: 0,
      cancelledOrders: 0,
      totalRevenue: 0,
      averageOrderValue: 0
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};
