# Code Style Guide

## 🌊 Suni Platform Code Standards

This document outlines the coding standards and best practices for the Suni platform development.

## 📋 General Principles

### 1. Consistency
- Follow established patterns throughout the codebase
- Use consistent naming conventions
- Maintain uniform code structure

### 2. Readability
- Write self-documenting code
- Use meaningful variable and function names
- Add comments for complex logic

### 3. Maintainability
- Keep functions small and focused
- Avoid deep nesting
- Use modern JavaScript/TypeScript features

### 4. Performance
- Optimize for both development and production
- Use appropriate data structures
- Implement efficient algorithms

## 🎯 TypeScript Standards

### Type Definitions
```typescript
// Use interfaces for object shapes
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// Use enums for constants
enum UserRole {
  GUEST = 'guest',
  MEMBER = 'member',
  ADMIN = 'admin',
  STAFF = 'staff'
}

// Use type aliases for unions
type ProductType = 'physical' | 'digital';
type OrderStatus = 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
```

### Function Definitions
```typescript
// Use explicit return types for public functions
export const createUser = async (userData: CreateUserDto): Promise<User> => {
  // Implementation
};

// Use arrow functions for simple operations
const isActiveUser = (user: User): boolean => user.role !== UserRole.GUEST;

// Use async/await instead of promises
export const fetchUserById = async (id: string): Promise<User | null> => {
  try {
    const user = await User.findById(id);
    return user;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
```

### Error Handling
```typescript
// Use custom error classes
class ValidationError extends Error {
  constructor(message: string, public field: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Handle errors appropriately
export const validateUser = (userData: any): void => {
  if (!userData.email) {
    throw new ValidationError('Email is required', 'email');
  }
  if (!userData.name) {
    throw new ValidationError('Name is required', 'name');
  }
};
```

## ⚛️ React Standards

### Component Structure
```typescript
// Use functional components with hooks
import React, { useState, useEffect } from 'react';
import { User } from '@/types/user';

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onEdit, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleEdit = () => {
    onEdit(user);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      await onDelete(user.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      <div className="actions">
        <button onClick={handleEdit} disabled={isLoading}>
          Edit
        </button>
        <button onClick={handleDelete} disabled={isLoading}>
          {isLoading ? 'Deleting...' : 'Delete'}
        </button>
      </div>
    </div>
  );
};
```

### Hooks Usage
```typescript
// Custom hooks for reusable logic
export const useUser = (userId: string) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const userData = await userService.getUser(userId);
        setUser(userData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch user');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return { user, loading, error };
};
```

### State Management
```typescript
// Use Zustand for global state
import { create } from 'zustand';

interface UserStore {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
```

## 🎨 CSS/Tailwind Standards

### Class Organization
```typescript
// Group related classes together
<div className="
  flex items-center justify-between
  p-4 bg-white rounded-lg shadow-md
  hover:shadow-lg transition-shadow duration-200
  border border-gray-200
">
  {/* Content */}
</div>
```

### Custom Components
```typescript
// Create reusable styled components
const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const baseClasses = 'font-medium rounded-lg transition-colors duration-200';
  
  const variantClasses = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-beach-500 hover:bg-beach-600 text-white',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-600 hover:text-white',
  };
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      {...props}
    >
      {children}
    </button>
  );
};
```

### Responsive Design
```typescript
// Use mobile-first approach
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
  xl:grid-cols-4
">
  {/* Grid items */}
</div>
```

## 🗄️ Database Standards

### Mongoose Schemas
```typescript
// Define clear schemas with validation
import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  password: string;
  role: UserRole;
  profile?: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    avatar?: string;
  };
  preferences?: {
    language: string;
    currency: string;
    notifications: boolean;
  };
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters']
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    default: UserRole.MEMBER
  },
  profile: {
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phone: { type: String, trim: true },
    avatar: { type: String }
  },
  preferences: {
    language: { type: String, default: 'en' },
    currency: { type: String, default: 'USD' },
    notifications: { type: Boolean, default: true }
  },
  isActive: { type: Boolean, default: true },
  lastLoginAt: { type: Date }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add indexes for performance
userSchema.index({ email: 1 });
userSchema.index({ role: 1 });
userSchema.index({ isActive: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
```

## 🔧 API Standards

### Controller Structure
```typescript
// Use consistent controller patterns
export class UserController {
  // GET /api/users
  public static async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const { page = 1, limit = 10, role, search } = req.query;
      
      const filter: any = {};
      if (role) filter.role = role;
      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(filter)
        .select('-password')
        .limit(Number(limit) * 1)
        .skip((Number(page) - 1) * Number(limit))
        .sort({ createdAt: -1 });

      const total = await User.countDocuments(filter);

      res.json({
        success: true,
        data: users,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // POST /api/users
  public static async createUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, name, password, role } = req.body;

      // Validation
      if (!email || !name || !password) {
        return res.status(400).json({
          success: false,
          message: 'Email, name, and password are required'
        });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      // Create user
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({
        email,
        name,
        password: hashedPassword,
        role: role || UserRole.MEMBER
      });

      await user.save();

      res.status(201).json({
        success: true,
        data: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      next(error);
    }
  }
}
```

### Route Definitions
```typescript
// Use consistent route patterns
import { Router } from 'express';
import { UserController } from '@/controllers/UserController';
import { authMiddleware } from '@/middleware/auth';
import { validateRequest } from '@/middleware/validation';
import { createUserSchema, updateUserSchema } from '@/schemas/user';

const router = Router();

// Public routes
router.post('/register', validateRequest(createUserSchema), UserController.createUser);
router.post('/login', UserController.login);

// Protected routes
router.use(authMiddleware);

router.get('/', UserController.getUsers);
router.get('/:id', UserController.getUserById);
router.put('/:id', validateRequest(updateUserSchema), UserController.updateUser);
router.delete('/:id', UserController.deleteUser);

export default router;
```

## 🧪 Testing Standards

### Unit Tests
```typescript
// Use descriptive test names
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password123'
      };

      const user = await UserService.createUser(userData);

      expect(user).toBeDefined();
      expect(user.email).toBe(userData.email);
      expect(user.name).toBe(userData.name);
      expect(user.password).not.toBe(userData.password); // Should be hashed
    });

    it('should throw error when email already exists', async () => {
      const userData = {
        email: 'existing@example.com',
        name: 'Test User',
        password: 'password123'
      };

      await expect(UserService.createUser(userData))
        .rejects
        .toThrow('User with this email already exists');
    });
  });
});
```

### Integration Tests
```typescript
// Test API endpoints
describe('POST /api/users', () => {
  it('should create a new user', async () => {
    const userData = {
      email: 'test@example.com',
      name: 'Test User',
      password: 'password123'
    };

    const response = await request(app)
      .post('/api/users')
      .send(userData)
      .expect(201);

    expect(response.body.success).toBe(true);
    expect(response.body.data.email).toBe(userData.email);
    expect(response.body.data.password).toBeUndefined();
  });
});
```

## 📝 Documentation Standards

### JSDoc Comments
```typescript
/**
 * Creates a new user in the system
 * @param userData - User information including email, name, and password
 * @param userData.email - User's email address (must be unique)
 * @param userData.name - User's display name
 * @param userData.password - User's password (will be hashed)
 * @param userData.role - User's role (defaults to MEMBER)
 * @returns Promise that resolves to the created user (without password)
 * @throws {ValidationError} When required fields are missing
 * @throws {ConflictError} When email already exists
 * @example
 * ```typescript
 * const user = await createUser({
 *   email: 'john@example.com',
 *   name: 'John Doe',
 *   password: 'securePassword123'
 * });
 * ```
 */
export const createUser = async (userData: CreateUserDto): Promise<User> => {
  // Implementation
};
```

## 🔍 Code Review Checklist

### Before Submitting PR
- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] No console.log statements in production code
- [ ] Error handling is implemented
- [ ] TypeScript types are properly defined
- [ ] Documentation is updated
- [ ] No hardcoded values
- [ ] Security considerations addressed

### Review Focus Areas
- [ ] Code readability and maintainability
- [ ] Performance implications
- [ ] Security vulnerabilities
- [ ] Test coverage
- [ ] Error handling
- [ ] API design consistency
- [ ] Database query efficiency

---

**Remember**: Good code is not just working code, but code that others can easily understand and maintain! 🌊
