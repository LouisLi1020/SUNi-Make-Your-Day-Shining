// Export all models
export { User, UserRole, IUser } from './User';
export { Product, ProductType, ProductCategory, ProductStatus, IProduct } from './Product';
export { 
  Order, 
  OrderStatus, 
  PaymentStatus, 
  PaymentMethod, 
  ShippingMethod, 
  IOrder,
  IOrderItem,
  IShippingAddress,
  IBillingAddress,
  IPaymentInfo
} from './Order';

// Re-export mongoose for convenience
export { default as mongoose } from 'mongoose';
