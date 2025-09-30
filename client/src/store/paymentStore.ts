import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
}

export interface Payment {
  id: string;
  orderId: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  paymentMethod: PaymentMethod;
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaymentState {
  paymentMethods: PaymentMethod[];
  payments: Payment[];
  currentPayment: Payment | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setPaymentMethods: (methods: PaymentMethod[]) => void;
  addPaymentMethod: (method: PaymentMethod) => void;
  removePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  setPayments: (payments: Payment[]) => void;
  addPayment: (payment: Payment) => void;
  setCurrentPayment: (payment: Payment | null) => void;
  updatePaymentStatus: (paymentId: string, status: Payment['status']) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  getDefaultPaymentMethod: () => PaymentMethod | undefined;
  getPaymentById: (id: string) => Payment | undefined;
}

export const usePaymentStore = create<PaymentState>()(
  persist(
    (set, get) => ({
      paymentMethods: [],
      payments: [],
      currentPayment: null,
      isLoading: false,
      error: null,

      setPaymentMethods: (paymentMethods: PaymentMethod[]) => {
        set({ paymentMethods });
      },

      addPaymentMethod: (method: PaymentMethod) => {
        const { paymentMethods } = get();
        set({
          paymentMethods: [...paymentMethods, method]
        });
      },

      removePaymentMethod: (id: string) => {
        const { paymentMethods } = get();
        set({
          paymentMethods: paymentMethods.filter(method => method.id !== id)
        });
      },

      setDefaultPaymentMethod: (id: string) => {
        const { paymentMethods } = get();
        set({
          paymentMethods: paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === id
          }))
        });
      },

      setPayments: (payments: Payment[]) => {
        set({ payments });
      },

      addPayment: (payment: Payment) => {
        const { payments } = get();
        set({
          payments: [payment, ...payments]
        });
      },

      setCurrentPayment: (currentPayment: Payment | null) => {
        set({ currentPayment });
      },

      updatePaymentStatus: (paymentId: string, status: Payment['status']) => {
        const { payments } = get();
        set({
          payments: payments.map(payment =>
            payment.id === paymentId
              ? { ...payment, status, updatedAt: new Date().toISOString() }
              : payment
          )
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      getDefaultPaymentMethod: () => {
        const { paymentMethods } = get();
        return paymentMethods.find(method => method.isDefault);
      },

      getPaymentById: (id: string) => {
        const { payments } = get();
        return payments.find(payment => payment.id === id);
      }
    }),
    {
      name: 'payment-storage',
      partialize: (state) => ({
        paymentMethods: state.paymentMethods,
        payments: state.payments,
        currentPayment: state.currentPayment
      })
    }
  )
);
