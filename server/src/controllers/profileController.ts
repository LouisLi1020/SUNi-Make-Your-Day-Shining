import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { AuthenticatedRequest } from '../middleware/auth';

// Get user profile
export const getProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user = await User.findById(userId)
      .select('-password -refreshToken')
      .populate('profile')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          profile: user.profile,
          preferences: user.preferences,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
export const updateProfile = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const updateData = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Remove sensitive fields that shouldn't be updated through this endpoint
    const { password, email, role, isActive, ...allowedUpdates } = updateData;

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        ...allowedUpdates,
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isActive: user.isActive,
          profile: user.profile,
          preferences: user.preferences,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user activity history
export const getActivityHistory = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { page = 1, limit = 10, type } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const skip = (Number(page) - 1) * Number(limit);
    let activities = [];

    // Get orders
    if (!type || type === 'orders') {
      const orders = await Order.find({ user: userId })
        .populate('items.product', 'name price images')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .lean();

      activities.push(...orders.map(order => ({
        type: 'order',
        id: order._id,
        status: order.status,
        total: (order as any).total || 0,
        items: order.items,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt
      })));
    }

    // Get reviews (if implemented)
    // if (!type || type === 'reviews') {
    //   const reviews = await Review.find({ user: userId })
    //     .populate('product', 'name images')
    //     .sort({ createdAt: -1 })
    //     .skip(skip)
    //     .limit(Number(limit))
    //     .lean();
    // }

    // Sort all activities by date
    activities.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    res.json({
      success: true,
      data: {
        activities: activities.slice(0, Number(limit)),
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total: activities.length,
          pages: Math.ceil(activities.length / Number(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics
export const getUserStats = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // Get order statistics
    const orderStats = await Order.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$total' },
          averageOrderValue: { $avg: '$total' },
          completedOrders: {
            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
          }
        }
      }
    ]);

    // Get favorite categories
    const favoriteCategories = await Order.aggregate([
      { $match: { user: userId } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          count: { $sum: 1 },
          totalSpent: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const stats = {
      orders: orderStats[0] || {
        totalOrders: 0,
        totalSpent: 0,
        averageOrderValue: 0,
        completedOrders: 0
      },
      favoriteCategories: favoriteCategories.map(cat => ({
        category: cat._id,
        orderCount: cat.count,
        totalSpent: cat.totalSpent
      }))
    };

    res.json({
      success: true,
      data: { stats }
    });
  } catch (error) {
    next(error);
  }
};

// Upload profile picture
export const uploadProfilePicture = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    // For now, we'll handle file upload logic here
    // In production, you'd want to use multer middleware and cloud storage
    const { imageUrl } = req.body;

    if (!imageUrl) {
      return res.status(400).json({
        success: false,
        message: 'Image URL is required'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        'profile.avatar': imageUrl,
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('-password -refreshToken');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Profile picture updated successfully',
      data: {
        avatar: user.profile?.avatar
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete user account
export const deleteAccount = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { password } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required to delete account'
      });
    }

    // Verify password before deletion
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Invalid password'
      });
    }

    // Soft delete - mark as inactive instead of actually deleting
    await User.findByIdAndUpdate(userId, {
      isActive: false,
      deletedAt: new Date(),
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Get user preferences
export const getPreferences = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user = await User.findById(userId)
      .select('preferences')
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        preferences: user.preferences || {}
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user preferences
export const updatePreferences = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { preferences } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User not authenticated'
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { 
        preferences: { ...preferences },
        updatedAt: new Date()
      },
      { 
        new: true, 
        runValidators: true 
      }
    ).select('preferences');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: {
        preferences: user.preferences
      }
    });
  } catch (error) {
    next(error);
  }
};
