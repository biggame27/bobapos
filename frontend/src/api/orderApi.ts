import API_BASE_URL from './config';

export interface OrderItem {
  menuitemid: number;
  quantity: number;
}

export interface CreateOrderData {
  timeoforder?: string;
  customerid?: number | null;
  employeeid: number;
  totalcost: number;
  orderweek: number;
  orderItems: OrderItem[];
}

export interface OrderResponse {
  orderid: number;
  timeoforder: string;
  customerid: number | null;
  employeeid: number;
  totalcost: number;
  orderweek: number;
}

export const createOrder = async (orderData: CreateOrderData): Promise<OrderResponse> => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(orderData)
  });

  const result = await response.json();
  if (result.success) {
    return result.data;
  }
  throw new Error(result.error || 'Failed to create order');
};

