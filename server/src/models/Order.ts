import mongoose, { Schema, Document } from 'mongoose';

// Order status enum
export enum OrderStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded'
}

// Payment status enum
export enum PaymentStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  PARTIALLY_REFUNDED = 'partially-refunded'
}

// Payment method enum
export enum PaymentMethod {
  CREDIT_CARD = 'credit-card',
  DEBIT_CARD = 'debit-card',
  PAYPAL = 'paypal',
  STRIPE = 'stripe',
  LINE_PAY = 'line-pay',
  WECHAT_PAY = 'wechat-pay'
}

// Shipping method enum
export enum ShippingMethod {
  STANDARD = 'standard',
  EXPRESS = 'express',
  OVERNIGHT = 'overnight',
  PICKUP = 'pickup',
  DIGITAL = 'digital'
}

// Order item interface
export interface IOrderItem {
  product: mongoose.Types.ObjectId;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  total: number;
  variant?: {
    name: string;
    options: { [key: string]: string };
  };
  digitalDelivery?: {
    type: 'email' | 'download' | 'streaming';
    files?: string[];
    instructions?: string;
  };
}

// Shipping address interface
export interface IShippingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

// Billing address interface
export interface IBillingAddress {
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
}

// Payment information interface
export interface IPaymentInfo {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  gatewayResponse?: any;
  paidAt?: Date;
  refundedAt?: Date;
  refundAmount?: number;
  refundReason?: string;
}

// Order interface
export interface IOrder extends Document {
  orderNumber: string;
  user: mongoose.Types.ObjectId;
  items: IOrderItem[];
  pricing: {
    subtotal: number;
    tax: number;
    shipping: number;
    discount: number;
    total: number;
    currency: string;
  };
  shipping: {
    method: ShippingMethod;
    address: IShippingAddress;
    trackingNumber?: string;
    estimatedDelivery?: Date;
    deliveredAt?: Date;
    notes?: string;
  };
  billing: {
    address: IBillingAddress;
    sameAsShipping: boolean;
  };
  payment: IPaymentInfo;
  status: OrderStatus;
  notes?: string;
  internalNotes?: string;
  tags: string[];
  metadata?: {
    [key: string]: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

// Order schema
const orderSchema = new Schema<IOrder>({
  orderNumber: {
    type: String,
    required: [true, 'Order number is required'],
    unique: true,
    uppercase: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required']
  },
  items: [{
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    sku: {
      type: String,
      required: true
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    total: {
      type: Number,
      required: true,
      min: 0
    },
    variant: {
      name: String,
      options: {
        type: Map,
        of: String
      }
    },
    digitalDelivery: {
      type: {
        type: String,
        enum: ['email', 'download', 'streaming']
      },
      files: [String],
      instructions: String
    }
  }],
  pricing: {
    subtotal: {
      type: Number,
      required: true,
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
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'TWD', 'CNY', 'JPY', 'KRW']
    }
  },
  shipping: {
    method: {
      type: String,
      enum: Object.values(ShippingMethod),
      required: true
    },
    address: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      company: String,
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: String
    },
    trackingNumber: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    notes: String
  },
  billing: {
    address: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      company: String,
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
      phone: String
    },
    sameAsShipping: {
      type: Boolean,
      default: true
    }
  },
  payment: {
    method: {
      type: String,
      enum: Object.values(PaymentMethod),
      required: true
    },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING
    },
    transactionId: String,
    gatewayResponse: Schema.Types.Mixed,
    paidAt: Date,
    refundedAt: Date,
    refundAmount: { type: Number, min: 0 },
    refundReason: String
  },
  status: {
    type: String,
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING
  },
  notes: String,
  internalNotes: String,
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  metadata: {
    type: Map,
    of: Schema.Types.Mixed
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for total items count
orderSchema.virtual('totalItems').get(function() {
  return this.items.reduce((total, item) => total + item.quantity, 0);
});

// Virtual for order age in days
orderSchema.virtual('ageInDays').get(function() {
  return Math.floor((Date.now() - this.createdAt.getTime()) / (1000 * 60 * 60 * 24));
});

// Virtual for is digital order
orderSchema.virtual('isDigitalOrder').get(function() {
  return this.items.every(item => item.digitalDelivery);
});

// Indexes for performance
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ user: 1 });
orderSchema.index({ status: 1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ 'shipping.method': 1 });
orderSchema.index({ tags: 1 });

// Compound indexes
orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });

// Pre-save middleware to generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const sequence = (count + 1).toString().padStart(4, '0');
    this.orderNumber = `SN${year}${month}${day}${sequence}`;
  }
  next();
});

// Pre-save middleware to calculate totals
orderSchema.pre('save', function(next) {
  // Calculate subtotal from items
  this.pricing.subtotal = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);

  // Calculate total
  this.pricing.total = this.pricing.subtotal + 
                      this.pricing.tax + 
                      this.pricing.shipping - 
                      this.pricing.discount;

  next();
});

// Static method to find orders by user
orderSchema.statics.findByUser = function(userId: string) {
  return this.find({ user: userId }).sort({ createdAt: -1 });
};

// Static method to find orders by status
orderSchema.statics.findByStatus = function(status: OrderStatus) {
  return this.find({ status }).sort({ createdAt: -1 });
};

// Static method to find pending orders
orderSchema.statics.findPendingOrders = function() {
  return this.find({ 
    status: { $in: [OrderStatus.PENDING, OrderStatus.CONFIRMED] }
  }).sort({ createdAt: -1 });
};

// Static method to get order statistics
orderSchema.statics.getOrderStats = function(startDate?: Date, endDate?: Date) {
  const match: any = {};
  if (startDate || endDate) {
    match.createdAt = {};
    if (startDate) match.createdAt.$gte = startDate;
    if (endDate) match.createdAt.$lte = endDate;
  }

  return this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$pricing.total' },
        averageOrderValue: { $avg: '$pricing.total' },
        statusCounts: {
          $push: '$status'
        }
      }
    }
  ]);
};

export const Order = mongoose.model<IOrder>('Order', orderSchema);
