import { Request, Response, NextFunction } from 'express';
import { User, UserRole, IUser } from '../models/User';
import { AppError } from '../middleware/errorHandler';

// Get all users (Admin only)
export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const role = req.query.role as UserRole;
    const search = req.query.search as string;
    const isActive = req.query.isActive as string;

    // Build filter
    const filter: any = {};
    if (role) filter.role = role;
    if (isActive !== undefined) filter.isActive = isActive === 'true';
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get users
    const users = await User.find(filter)
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Get total count
    const total = await User.countDocuments(filter);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user by ID
export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id)
      .select('-password -emailVerificationToken -passwordResetToken -passwordResetExpires');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user
      }
    });
  } catch (error) {
    next(error);
  }
};

// Create user (Admin only)
export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, password, role = UserRole.MEMBER, isActive = true } = req.body;

    // Validation
    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email, name, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user
    const user = new User({
      email: email.toLowerCase(),
      name,
      password,
      role,
      isActive,
      isEmailVerified: true // Admin created users are pre-verified
    });

    await user.save();

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Update user
export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { name, role, isActive, profile, preferences } = req.body;

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    if (name) user.name = name;
    if (role && req.user?.role === UserRole.ADMIN) user.role = role;
    if (isActive !== undefined && req.user?.role === UserRole.ADMIN) user.isActive = isActive;
    if (profile) user.profile = { ...user.profile, ...profile };
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    res.json({
      success: true,
      message: 'User updated successfully',
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Delete user (Admin only)
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Prevent admin from deleting themselves
    if (id === (req.user?._id as any).toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - deactivate instead of removing
    user.isActive = false;
    await user.save();

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });
  } catch (error) {
    next(error);
  }
};

// Activate/Deactivate user (Admin only)
export const toggleUserStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { isActive } = req.body;

    // Prevent admin from deactivating themselves
    if (id === (req.user?._id as any).toString() && isActive === false) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.isActive = isActive;
    await user.save();

    res.json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        user: user.toJSON()
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get user statistics (Admin only)
export const getUserStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    
    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentUsers = await User.find()
      .select('name email role createdAt')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      data: {
        totalUsers,
        activeUsers,
        verifiedUsers,
        roleStats,
        recentUsers
      }
    });
  } catch (error) {
    next(error);
  }
};

// Search users
export const searchUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, role, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const filter: any = {
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } }
      ]
    };

    if (role) {
      filter.role = role;
    }

    const users = await User.find(filter)
      .select('name email role isActive')
      .limit(parseInt(limit as string));

    res.json({
      success: true,
      data: {
        users
      }
    });
  } catch (error) {
    next(error);
  }
};
