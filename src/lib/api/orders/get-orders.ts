import api from "@/src/lib/axios";
import { QueryConfig } from "@/src/lib/react-query";
import { Meta } from "@/src/types/meta";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { OrderResponse } from "./get-order";

export interface OrdersListResponse {
  data: OrderResponse[];
  meta: Meta;
}

export const getOrders = async (
  page = 1,
  limit = 10
): Promise<OrdersListResponse> => {
  const response = await api.get("/orders", {
    params: { page, limit },
  });
  return response.data;
};

export const getOrdersQueryKey = (page: number, limit: number) => [
  "orders",
  page,
  limit,
];

export const getOrdersQueryOptions = (page: number, limit: number) => {
  return queryOptions({
    queryKey: getOrdersQueryKey(page, limit),
    queryFn: () => getOrders(page, limit),
  });
};

type UseGetOrdersParams = {
  queryConfig?: QueryConfig<typeof getOrdersQueryOptions>;
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
