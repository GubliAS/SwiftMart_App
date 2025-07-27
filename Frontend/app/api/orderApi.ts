import { BASE_URL } from '@/constants/env';

// Order service runs on port 8088
const ORDER_SERVICE_URL = `${BASE_URL.replace(':8080', ':8088')}`;

// Order status history service runs on port 8084
const ORDER_STATUS_HISTORY_SERVICE_URL = `${BASE_URL.replace(':8080', ':8084')}`;

// Types for order API
export interface OrderLineRequest {
  productItemId: number;
  qty: number;
  price: number;
}

export interface CreateOrderRequest {
  userId: number;
  paymentMethodId: number;
  shippingAddress: string;
  shippingMethodId: number;
  orderTotal: number;
  orderLines: OrderLineRequest[];
}

export interface OrderLine {
  id: number;
  productItemId: number;
  orderId: number;
  price: number;
  qty: number;
}

export interface Order {
  id: number;
  userId: number;
  orderDate: string;
  paymentMethodId: number;
  shippingAddress: string;
  shippingMethodId: number;
  orderTotal: number;
  orderStatus: string;
}

export interface OrderResponse {
  orderId: number;
  userId: number;
  orderDate: string;
  paymentMethodId: number;
  shippingAddress: string;
  shippingMethodId: number;
  orderTotal: number;
  orderStatus: string;
  orderLines: OrderLine[];
  message: string;
}

// Order Status History types
export interface OrderStatusHistory {
  id: number;
  orderId: number;
  statusId: number;
  changedAt: string;
}

// Helper function to get headers with optional auth
const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

// API functions
export const createOrder = async (orderData: CreateOrderRequest, token?: string): Promise<OrderResponse> => {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/api/orders`, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const getOrdersByUser = async (userId: number, token?: string): Promise<Order[]> => {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/api/orders/user/${userId}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

export const getOrderById = async (orderId: number, token?: string): Promise<Order> => {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/api/orders/${orderId}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    throw error;
  }
};

export const getOrderLines = async (orderId: number, token?: string): Promise<OrderLine[]> => {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/api/orders/${orderId}/lines`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order lines');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching order lines:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: number, status: string, token?: string): Promise<Order> => {
  try {
    const response = await fetch(`${ORDER_SERVICE_URL}/api/orders/${orderId}/status?status=${status}`, {
      method: 'PUT',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to update order status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

// New function to get order status history
export const getOrderStatusHistory = async (orderId: number, token?: string): Promise<OrderStatusHistory[]> => {
  try {
    const response = await fetch(`${ORDER_STATUS_HISTORY_SERVICE_URL}/api/order-status-history/order/${orderId}`, {
      method: 'GET',
      headers: getHeaders(token),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch order status history');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching order status history:', error);
    throw error;
  }
};

export default {
  createOrder,
  getOrdersByUser,
  getOrderById,
  getOrderLines,
  updateOrderStatus,
  getOrderStatusHistory,
};