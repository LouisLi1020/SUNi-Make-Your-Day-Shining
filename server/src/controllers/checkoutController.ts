import { Request, Response, NextFunction } from 'express';
import { Cart, ICart, CartStatus } from '../models/Cart';
import { Order, OrderStatus, PaymentStatus, PaymentMethod, ShippingMethod } from '../models/Order';
import { Product } from '../models/Product';
import { AuthenticatedRequest } from '../middleware/auth';
import mongoose from 'mongoose';

// Initialize checkout
export const initializeCheckout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID or session ID is required'
      });
    }

    // Get and validate cart
    const cart = await Cart.findActiveCart(
      userId ? new mongoose.Types.ObjectId(userId) : undefined,
      sessionId
    );

    if (!cart || cart.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate cart items
    const validationErrors: any[] = [];
    const productIds = cart.items.map((item: any) => item.product);

    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p: any) => [p._id.toString(), p]));

    for (const item of cart.items) {
      const product = productMap.get(item.product.toString());
      
      if (!product) {
        validationErrors.push({
          productId: item.product,
          error: 'Product not found'
        });
        continue;
      }

      if (!(product as any).isActive) {
        validationErrors.push({
          productId: item.product,
          error: 'Product is not available'
        });
        continue;
      }

      if (product.inventory.trackInventory && product.inventory.quantity < item.quantity) {
        validationErrors.push({
          productId: item.product,
          error: 'Insufficient inventory',
          available: product.inventory.quantity,
          requested: item.quantity
        });
        continue;
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart validation failed',
        errors: validationErrors
      });
    }

    // Calculate shipping and tax (simplified)
    const shipping = calculateShipping(cart);
    const tax = calculateTax(cart.subtotal);

    // Update cart with calculated values
    cart.shipping = shipping;
    cart.tax = tax;
    cart.total = cart.subtotal + shipping + tax - cart.discount;
    await cart.save();

    res.json({
      success: true,
      data: {
        cart,
        checkout: {
          subtotal: cart.subtotal,
          shipping: cart.shipping,
          tax: cart.tax,
          discount: cart.discount,
          total: cart.total,
          currency: cart.currency
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Process checkout
export const processCheckout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;
    const {
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingMethod = ShippingMethod.STANDARD,
      notes
    } = req.body;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID or session ID is required'
      });
    }

    // Get and validate cart
    const cart = await Cart.findActiveCart(
      userId ? new mongoose.Types.ObjectId(userId) : undefined,
      sessionId
    );

    if (!cart || cart.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    // Validate required fields
    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Payment method is required'
      });
    }

    // Validate cart items again
    const validationErrors: any[] = [];
    const productIds = cart.items.map((item: any) => item.product);

    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p: any) => [p._id.toString(), p]));

    for (const item of cart.items) {
      const product = productMap.get(item.product.toString());
      
      if (!product) {
        validationErrors.push({
          productId: item.product,
          error: 'Product not found'
        });
        continue;
      }

      if (!(product as any).isActive) {
        validationErrors.push({
          productId: item.product,
          error: 'Product is not available'
        });
        continue;
      }

      if (product.inventory.trackInventory && product.inventory.quantity < item.quantity) {
        validationErrors.push({
          productId: item.product,
          error: 'Insufficient inventory',
          available: product.inventory.quantity,
          requested: item.quantity
        });
        continue;
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart validation failed',
        errors: validationErrors
      });
    }

    // Create order
    const order = new Order({
      user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
      sessionId: sessionId,
      items: cart.items.map((item: any) => ({
        product: item.product,
        name: item.product.name,
        sku: item.product.sku,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity,
        variant: item.variant
      })),
      status: OrderStatus.PENDING,
      payment: {
        method: paymentMethod,
        status: PaymentStatus.PENDING,
        amount: cart.total,
        currency: cart.currency
      },
      shipping: {
        method: shippingMethod,
        address: shippingAddress,
        cost: cart.shipping
      },
      billing: {
        address: billingAddress || shippingAddress
      },
      pricing: {
        subtotal: cart.subtotal,
        tax: cart.tax,
        shipping: cart.shipping,
        discount: cart.discount,
        total: cart.total
      },
      notes: notes
    });

    await order.save();

    // Update inventory
    for (const item of cart.items) {
      const product = productMap.get(item.product.toString());
      if (product && product.inventory.trackInventory) {
        product.inventory.quantity -= item.quantity;
        await product.save();
      }
    }

    // Mark cart as converted
    cart.status = CartStatus.CONVERTED;
    await cart.save();

    res.json({
      success: true,
      message: 'Order created successfully',
      data: {
        order
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get checkout session
export const getCheckoutSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID or session ID is required'
      });
    }

    const cart = await Cart.findActiveCart(
      userId ? new mongoose.Types.ObjectId(userId) : undefined,
      sessionId
    );

    if (!cart || cart.isEmpty()) {
      return res.status(404).json({
        success: false,
        message: 'No active checkout session found'
      });
    }

    res.json({
      success: true,
      data: {
        cart,
        checkout: {
          subtotal: cart.subtotal,
          shipping: cart.shipping,
          tax: cart.tax,
          discount: cart.discount,
          total: cart.total,
          currency: cart.currency
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update shipping method
export const updateShippingMethod = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;
    const { shippingMethod } = req.body;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID or session ID is required'
      });
    }

    const cart = await Cart.findActiveCart(
      userId ? new mongoose.Types.ObjectId(userId) : undefined,
      sessionId
    );

    if (!cart || cart.isEmpty()) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Recalculate shipping
    const shipping = calculateShipping(cart, shippingMethod);
    cart.shipping = shipping;
    cart.total = cart.subtotal + cart.tax + shipping - cart.discount;
    await cart.save();

    res.json({
      success: true,
      message: 'Shipping method updated successfully',
      data: {
        cart,
        checkout: {
          subtotal: cart.subtotal,
          shipping: cart.shipping,
          tax: cart.tax,
          discount: cart.discount,
          total: cart.total,
          currency: cart.currency
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Apply discount code
export const applyDiscountCode = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;
    const { discountCode } = req.body;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID or session ID is required'
      });
    }

    if (!discountCode) {
      return res.status(400).json({
        success: false,
        message: 'Discount code is required'
      });
    }

    const cart = await Cart.findActiveCart(
      userId ? new mongoose.Types.ObjectId(userId) : undefined,
      sessionId
    );

    if (!cart || cart.isEmpty()) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // TODO: Implement discount code validation
    // For now, we'll use a simple mock
    const discount = validateDiscountCode(discountCode, cart);
    
    if (discount === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid discount code'
      });
    }

    cart.discount = discount;
    cart.total = cart.subtotal + cart.tax + cart.shipping - discount;
    await cart.save();

    res.json({
      success: true,
      message: 'Discount code applied successfully',
      data: {
        cart,
        checkout: {
          subtotal: cart.subtotal,
          shipping: cart.shipping,
          tax: cart.tax,
          discount: cart.discount,
          total: cart.total,
          currency: cart.currency
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Helper functions
function calculateShipping(cart: ICart, method: ShippingMethod = ShippingMethod.STANDARD): number {
  // Simplified shipping calculation
  const baseShipping = 10; // $10 base shipping
  const weightMultiplier = 0.5; // $0.5 per item
  
  let shipping = baseShipping + (cart.itemCount * weightMultiplier);
  
  switch (method) {
    case ShippingMethod.EXPRESS:
      shipping *= 2;
      break;
    case ShippingMethod.OVERNIGHT:
      shipping *= 3;
      break;
    case ShippingMethod.PICKUP:
      shipping = 0;
      break;
    case ShippingMethod.DIGITAL:
      shipping = 0;
      break;
  }
  
  return Math.round(shipping * 100) / 100; // Round to 2 decimal places
}

function calculateTax(subtotal: number): number {
  // Simplified tax calculation (8% tax rate)
  return Math.round(subtotal * 0.08 * 100) / 100;
}

function validateDiscountCode(code: string, cart: ICart): number {
  // Mock discount codes
  const discountCodes: { [key: string]: { type: 'percentage' | 'fixed', value: number, minAmount?: number } } = {
    'WELCOME10': { type: 'percentage', value: 10, minAmount: 50 },
    'SAVE20': { type: 'fixed', value: 20, minAmount: 100 },
    'FREESHIP': { type: 'fixed', value: 0, minAmount: 0 } // Special case for free shipping
  };
  
  const discount = discountCodes[code.toUpperCase()];
  
  if (!discount) {
    return 0;
  }
  
  if (discount.minAmount && cart.subtotal < discount.minAmount) {
    return 0;
  }
  
  if (discount.type === 'percentage') {
    return Math.round(cart.subtotal * (discount.value / 100) * 100) / 100;
  } else {
    return Math.min(discount.value, cart.subtotal);
  }
}
