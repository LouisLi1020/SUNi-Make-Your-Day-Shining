import mongoose, { Document, Schema } from 'mongoose';

// Cart item interface
export interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
  variant?: {
    size?: string;
    color?: string;
    [key: string]: any;
  };
  price: number;
  addedAt: Date;
}

// Cart status enum
export enum CartStatus {
  ACTIVE = 'active',
  ABANDONED = 'abandoned',
  CONVERTED = 'converted',
  EXPIRED = 'expired'
}

// Main Cart interface
export interface ICart extends Document {
  user?: mongoose.Types.ObjectId;
  sessionId?: string;
  items: ICartItem[];
  status: CartStatus;
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
  lastAccessedAt: Date;
  
  // Virtual properties
  itemCount: number;
  uniqueProductCount: number;
  
  // Instance methods
  updateItemQuantity(productId: mongoose.Types.ObjectId, quantity: number, variant?: any): ICart;
  removeItem(productId: mongoose.Types.ObjectId, variant?: any): ICart;
  clearCart(): ICart;
  isEmpty(): boolean;
  calculateTotal(): number;
}

// Define static methods interface first
interface ICartModel extends mongoose.Model<ICart> {
  findActiveCart(userId?: mongoose.Types.ObjectId, sessionId?: string): Promise<ICart | null>;
  findOrCreateCart(userId?: mongoose.Types.ObjectId, sessionId?: string): Promise<ICart>;
  cleanupExpiredCarts(): Promise<any>;
  getCartStats(): Promise<any[]>;
}

// Cart Schema
const cartSchema = new Schema<ICart, ICartModel>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  sessionId: {
    type: String,
    required: false,
    index: true
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 99
    },
    variant: {
      type: Schema.Types.Mixed,
      default: null
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: Object.values(CartStatus),
    default: CartStatus.ACTIVE
  },
  subtotal: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  shipping: {
    type: Number,
    default: 0,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  total: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'TWD',
    uppercase: true
  },
  expiresAt: {
    type: Date
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
cartSchema.index({ user: 1, status: 1 });
cartSchema.index({ sessionId: 1, status: 1 });
cartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for item count
cartSchema.virtual('itemCount').get(function() {
  return this.items.reduce((total: number, item: ICartItem) => total + item.quantity, 0);
});

// Virtual for unique product count
cartSchema.virtual('uniqueProductCount').get(function() {
  return this.items.length;
});

// Instance methods
cartSchema.methods.updateItemQuantity = function(productId: mongoose.Types.ObjectId, quantity: number, variant?: any) {
  const item = this.items.find((item: ICartItem) => {
    if (variant) {
      return item.product.equals(productId) && 
             JSON.stringify(item.variant) === JSON.stringify(variant);
    }
    return item.product.equals(productId);
  });

  if (item) {
    if (quantity <= 0) {
      this.items = this.items.filter((item: ICartItem) => !item.product.equals(productId));
    } else {
      item.quantity = quantity;
    }
  }
  return this;
};

cartSchema.methods.removeItem = function(productId: mongoose.Types.ObjectId, variant?: any) {
  if (variant) {
    this.items = this.items.filter((item: ICartItem) => 
      !(item.product.equals(productId) && JSON.stringify(item.variant) === JSON.stringify(variant))
    );
  } else {
    this.items = this.items.filter((item: ICartItem) => !item.product.equals(productId));
  }
  return this;
};

cartSchema.methods.clearCart = function() {
  this.items = [];
  this.subtotal = 0;
  this.tax = 0;
  this.shipping = 0;
  this.discount = 0;
  this.total = 0;
  return this;
};

cartSchema.methods.isEmpty = function() {
  return this.items.length === 0;
};

cartSchema.methods.calculateTotal = function() {
  // Calculate subtotal
  this.subtotal = this.items.reduce((total: number, item: ICartItem) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  // Calculate tax (5%)
  this.tax = this.subtotal * 0.05;
  
  // Calculate shipping (free over 1000 TWD)
  this.shipping = this.subtotal >= 1000 ? 0 : 100;
  
  // Calculate total
  this.total = this.subtotal + this.tax + this.shipping - this.discount;
  
  return this.total;
};

// Static methods
cartSchema.statics.findActiveCart = function(userId?: mongoose.Types.ObjectId, sessionId?: string) {
  const query: any = { status: CartStatus.ACTIVE };
  
  if (userId) {
    query.user = userId;
  } else if (sessionId) {
    query.sessionId = sessionId;
  }
  
  return this.findOne(query).populate('items.product');
};

cartSchema.statics.findOrCreateCart = function(userId?: mongoose.Types.ObjectId, sessionId?: string) {
  return this.findActiveCart(userId, sessionId).then((cart: ICart | null) => {
    if (cart) {
      return cart;
    }
    
    const newCart = new this({
      user: userId,
      sessionId: sessionId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    });
    
    return newCart.save();
  });
};

cartSchema.statics.cleanupExpiredCarts = function() {
  return this.updateMany(
    { 
      expiresAt: { $lt: new Date() },
      status: CartStatus.ACTIVE 
    },
    { status: CartStatus.EXPIRED }
  );
};

cartSchema.statics.getCartStats = function() {
  return this.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalValue: { $sum: '$total' },
        avgValue: { $avg: '$total' }
      }
    }
  ]);
};

// Pre-save middleware
cartSchema.pre('save', function(next) {
  this.lastAccessedAt = new Date();
  this.calculateTotal();
  next();
});

// Export the model
export const Cart = mongoose.model<ICart, ICartModel>('Cart', cartSchema);