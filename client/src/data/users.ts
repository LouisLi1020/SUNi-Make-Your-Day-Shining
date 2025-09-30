export interface Address {
  id: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone?: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expiryMonth: string;
  expiryYear: string;
  nickname?: string;
  isDefault: boolean;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  variant?: string;
  inStock: boolean;
}

export interface Order {
  id: string;
  userId?: string;
  guestEmail?: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  orderDate: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  items: Array<{
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
}

export const mockUser = {
  id: '1',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1 (555) 123-4567',
  joinDate: '2023-06-15',
  addresses: [] as Address[],
  paymentMethods: [] as PaymentMethod[],
  preferences: {
    emailMarketing: true,
    smsMarketing: false,
    newsletter: true,
    orderUpdates: true
  }
};

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    userId: '1',
    total: 244.97,
    status: 'delivered',
    orderDate: '2024-01-15',
    shippingAddress: {
      firstName: 'John',
      lastName: 'Doe',
      address1: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'US'
    },
    items: [
      {
        name: 'Luminous Home Diffuser',
        price: 89.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1757774636743-e5235c608fd0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjbGVhbiUyMGhvbWUlMjBhY2Nlc3Nvcmllc3xlbnwxfHx8fDE3NTkyMDk5MTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
      }
    ]
  }
];
