import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface ShippingAddress {
  name: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setOrders: (orders: Order[]) => void;
  setCurrentOrder: (order: Order | null) => void;
  addOrder: (order: Order) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getOrderById: (id: string) => Order | undefined;
  getOrdersByStatus: (status: Order['status']) => Order[];
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      currentOrder: null,
      isLoading: false,
      error: null,

      setOrders: (orders: Order[]) => {
        set({ orders });
      },

      setCurrentOrder: (currentOrder: Order | null) => {
        set({ currentOrder });
      },

      addOrder: (order: Order) => {
        const { orders } = get();
        set({
          orders: [order, ...orders]
        });
      },

      updateOrderStatus: (orderId: string, status: Order['status']) => {
        const { orders } = get();
        set({
          orders: orders.map(order =>
            order.id === orderId
              ? { ...order, status, updatedAt: new Date().toISOString() }
              : order
          )
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      getOrderById: (id: string) => {
        const { orders } = get();
        return orders.find(order => order.id === id);
      },

      getOrdersByStatus: (status: Order['status']) => {
        const { orders } = get();
        return orders.filter(order => order.status === status);
      }
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({
        orders: state.orders,
        currentOrder: state.currentOrder
      })
    }
  )
);
