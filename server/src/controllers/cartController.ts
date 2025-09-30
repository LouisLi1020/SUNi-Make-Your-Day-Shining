import { Request, Response, NextFunction } from 'express';
import { Cart, ICart, ICartItem, CartStatus } from '../models/Cart';
import { Product } from '../models/Product';
import mongoose from 'mongoose';
import { AuthenticatedRequest } from '../middleware/auth';

// Helper function to find active cart
const findActiveCart = async (userId?: string, sessionId?: string) => {
  const query: any = { status: CartStatus.ACTIVE };
  if (userId) {
    query.user = new mongoose.Types.ObjectId(userId);
  } else if (sessionId) {
    query.sessionId = sessionId;
  }
  
  return await Cart.findOne(query).populate('items.product');
};

// Get cart
export const getCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID or session ID is required'
      });
    }

    const cart = await findActiveCart(userId, sessionId);

    if (!cart) {
      // Create empty cart
      const newCart = new Cart({
        user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
        sessionId: sessionId,
        items: [],
        status: CartStatus.ACTIVE
      });
      await newCart.save();

      return res.json({
        success: true,
        data: {
          cart: newCart
        }
      });
    }

    res.json({
      success: true,
      data: {
        cart
      }
    });
  } catch (error) {
    next(error);
  }
};

// Add item to cart
export const addToCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;
    const { productId, quantity = 1, variant } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID or session ID is required'
      });
    }

    // Find or create cart
    let cart = await findActiveCart(userId, sessionId);

    if (!cart) {
      cart = new Cart({
        user: userId ? new mongoose.Types.ObjectId(userId) : undefined,
        sessionId: sessionId,
        items: [],
        status: CartStatus.ACTIVE
      });
    }

    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!(product as any).isActive) {
      return res.status(400).json({
        success: false,
        message: 'Product is not available'
      });
    }

    // Check inventory
    if (product.inventory.trackInventory && product.inventory.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient inventory'
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex((item: any) => {
      if (variant) {
        return item.product.equals(productId) && 
               JSON.stringify(item.variant) === JSON.stringify(variant);
      }
      return item.product.equals(productId);
    });

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const newQuantity = cart.items[existingItemIndex].quantity + quantity;
      
      if (product.inventory.trackInventory && product.inventory.quantity < newQuantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient inventory'
        });
      }
      
      cart.items[existingItemIndex].quantity = newQuantity;
    } else {
      // Add new item
      const cartItem: ICartItem = {
        product: new mongoose.Types.ObjectId(productId),
        price: product.price.base,
        quantity: quantity,
        variant: variant || {},
        addedAt: new Date()
      };
      
      cart.items.push(cartItem);
    }

    await cart.save();

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item quantity
export const updateCartItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;
    const { productId, quantity, variant } = req.body;

    if (!productId || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and quantity are required'
      });
    }

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID or session ID is required'
      });
    }

    const cart = await findActiveCart(userId, sessionId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Get product for inventory check
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (quantity > 0) {
      // Check inventory
      if (product.inventory.trackInventory && product.inventory.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: 'Insufficient inventory'
        });
      }
    }

    cart.updateItemQuantity(
      new mongoose.Types.ObjectId(productId),
      quantity,
      variant
    );

    await cart.save();

    res.json({
      success: true,
      message: 'Cart item updated successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
export const removeFromCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;
    const { productId, variant } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required'
      });
    }

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID or session ID is required'
      });
    }

    const cart = await findActiveCart(userId, sessionId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.removeItem(new mongoose.Types.ObjectId(productId), variant);
    await cart.save();

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    next(error);
  }
};

// Clear cart
export const clearCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID or session ID is required'
      });
    }

    const cart = await findActiveCart(userId, sessionId);

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    cart.clearCart();
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        cart
      }
    });
  } catch (error) {
    next(error);
  }
};

// Merge guest cart with user cart
export const mergeCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        message: 'Session ID is required'
      });
    }

    // Get user cart
    let userCart = await findActiveCart(userId);
    
    // Get guest cart
    const guestCart = await findActiveCart(undefined, sessionId);

    if (!guestCart || guestCart.isEmpty()) {
      return res.json({
        success: true,
        message: 'No guest cart to merge',
        data: {
          cart: userCart
        }
      });
    }

    if (!userCart) {
      // Create user cart and move guest items
      userCart = new Cart({
        user: new mongoose.Types.ObjectId(userId),
        items: guestCart.items,
        status: CartStatus.ACTIVE
      });
      
      // Mark guest cart as converted
      guestCart.status = CartStatus.CONVERTED;
      await guestCart.save();
    } else {
      // Merge items
      for (const guestItem of guestCart.items) {
        const existingItemIndex = userCart.items.findIndex((item: any) => {
          return item.product.equals(guestItem.product) &&
                 JSON.stringify(item.variant) === JSON.stringify(guestItem.variant);
        });

        if (existingItemIndex >= 0) {
          // Update quantity
          userCart.items[existingItemIndex].quantity += guestItem.quantity;
        } else {
          // Add new item
          userCart.items.push(guestItem);
        }
      }
      
      // Mark guest cart as converted
      guestCart.status = CartStatus.CONVERTED;
      await guestCart.save();
    }

    await userCart.save();

    res.json({
      success: true,
      message: 'Cart merged successfully',
      data: {
        cart: userCart
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get cart summary
export const getCartSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID or session ID is required'
      });
    }

    const cart = await findActiveCart(userId, sessionId);

    if (!cart) {
      return res.json({
        success: true,
        data: {
          summary: {
            itemCount: 0,
            uniqueProductCount: 0,
            subtotal: 0,
            tax: 0,
            shipping: 0,
            discount: 0,
            total: 0,
            currency: 'USD'
          }
        }
      });
    }

    res.json({
      success: true,
      data: {
        summary: {
          itemCount: cart.itemCount,
          uniqueProductCount: cart.uniqueProductCount,
          subtotal: cart.subtotal,
          tax: cart.tax,
          shipping: cart.shipping,
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

// Validate cart
export const validateCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const sessionId = req.headers['x-session-id'] as string;

    if (!userId && !sessionId) {
      return res.status(400).json({
        success: false,
        message: 'User ID or session ID is required'
      });
    }

    const cart = await findActiveCart(userId, sessionId);

    if (!cart || cart.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty'
      });
    }

    const validationErrors: any[] = [];
    const productIds = cart.items.map((item: any) => item.product);

    // Get all products in cart
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p: any) => [p._id.toString(), p]));

    // Validate each item
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

      // Check price changes
      if (product.price.base !== item.price) {
        validationErrors.push({
          productId: item.product,
          error: 'Price has changed',
          oldPrice: item.price,
          newPrice: product.price.base
        });
      }
    }

    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart validation failed',
        errors: validationErrors
      });
    }

    res.json({
      success: true,
      message: 'Cart is valid',
      data: {
        cart
      }
    });
  } catch (error) {
    next(error);
  }
};
