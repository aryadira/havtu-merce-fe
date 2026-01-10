import api from "@/src/lib/axios";
import {
  MutationConfig,
  QueryConfig,
  queryClient,
} from "@/src/lib/react-query";
import { Meta } from "@/src/types/meta";
import { ProductShop } from "@/src/types/product";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { getCartsQueryKey } from "./carts";

// --- Enums & Types ---

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

export interface OrdersListResponse {
  data: OrderResponse[];
  meta: Meta;
}

export type CheckoutItemDto = {
  product_id: string;
  item_qty: number;
};

export type CheckoutOrderDto = {
  items?: CheckoutItemDto[];
};

// --- Query Keys ---

export const getOrdersQueryKey = (page: number, limit: number) => [
  "orders",
  page,
  limit,
];
export const getOrdersManageQueryKey = (page: number, limit: number) => [
  "orders-manage",
  page,
  limit,
];
export const getOrderQueryKey = (orderId: string) => ["order", orderId];

// --- Get Orders ---
type UseGetOrdersParams = {
  queryConfig?: QueryConfig<typeof getOrdersQueryOptions>;
};

export const getOrders = async (
  page = 1,
  limit = 10
): Promise<OrdersListResponse> => {
  const response = await api.get("/orders", { params: { page, limit } });
  return response.data;
};

export const useGetOrders = (
  page: number,
  limit: number,
  params: UseGetOrdersParams = {}
) => {
  return useQuery({
    ...getOrdersQueryOptions(page, limit),
    ...params.queryConfig,
  });
};

export const getOrdersQueryOptions = (page: number, limit: number) => {
  return queryOptions({
    queryKey: getOrdersQueryKey(page, limit),
    queryFn: () => getOrders(page, limit),
  });
};

// --- Get Orders Manage ---
type UseGetOrdersManageParams = {
  queryConfig?: QueryConfig<typeof getOrdersManageQueryOptions>;
};

export const getOrdersManage = async (
  page = 1,
  limit = 10
): Promise<OrdersListResponse> => {
  const response = await api.get("/orders", { params: { page, limit } });
  return response.data;
};

export const useGetOrdersManage = (
  page: number,
  limit: number,
  params: UseGetOrdersManageParams = {}
) => {
  return useQuery({
    ...getOrdersManageQueryOptions(page, limit),
    ...params.queryConfig,
  });
};

export const getOrdersManageQueryOptions = (page: number, limit: number) => {
  return queryOptions({
    queryKey: getOrdersManageQueryKey(page, limit),
    queryFn: () => getOrdersManage(page, limit),
  });
};

// --- Get Order ---
interface UseGetOrderParams {
  orderId: string;
  queryConfig?: QueryConfig<typeof getOrderQueryOptions>;
}

export const getOrder = async (orderId: string): Promise<OrderResponse> => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

export const useGetOrder = ({ orderId, queryConfig }: UseGetOrderParams) => {
  return useQuery({
    ...getOrderQueryOptions(orderId),
    ...queryConfig,
    enabled: !!orderId,
  });
};

export const getOrderQueryOptions = (orderId: string) => {
  return queryOptions({
    queryKey: getOrderQueryKey(orderId),
    queryFn: () => getOrder(orderId),
  });
};

// --- Checkout ---
interface UseCheckoutParams {
  mutationConfig?: MutationConfig<typeof checkout>;
}

export const checkout = async (data: CheckoutOrderDto) => {
  const res = await api.post("/orders/checkout", data);
  return res.data;
};

export const useCheckout = (params: UseCheckoutParams = {}) => {
  return useMutation({
    mutationFn: checkout,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: getCartsQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};
