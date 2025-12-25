import api from "@/src/lib/axios";
import { ProductShop } from "@/src/types/product";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "@/src/lib/react-query";

export enum OrderStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum PaymentStatus {
  UNPAID = "UNPAID",
  PAID = "PAID",
  FAILED = "FAILED",
}

export interface OrderItemResponse {
  id: string;
  order_id: string;
  product_id: string;
  item_qty: number;
  item_price: number;
  subtotal: number;
  created_at: string;
  updated_at: string;
  product: ProductShop;
}

export interface OrderResponse {
  id: string;
  user_id: string;
  order_status: OrderStatus;
  payment_status: PaymentStatus;
  total_amount: number;
  created_at: string;
  updated_at: string;
  order_items: OrderItemResponse[];
}

export const getOrder = async (orderId: string): Promise<OrderResponse> => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const getOrderQueryKey = (orderId: string) => ["order", orderId];

export const getOrderQueryOptions = (orderId: string) => {
  return queryOptions({
    queryKey: getOrderQueryKey(orderId),
    queryFn: () => getOrder(orderId),
  });
};

interface UseGetOrderParams {
  orderId: string;
  queryConfig?: QueryConfig<typeof getOrderQueryOptions>;
}

export const useGetOrder = ({ orderId, queryConfig }: UseGetOrderParams) => {
  return useQuery({
    ...getOrderQueryOptions(orderId),
    ...queryConfig,
    enabled: !!orderId,
  });
};
