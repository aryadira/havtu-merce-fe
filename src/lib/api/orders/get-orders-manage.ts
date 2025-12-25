import api from "@/src/lib/axios";
import { QueryConfig } from "@/src/lib/react-query";
import { Meta } from "@/src/types/meta";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { OrderResponse } from "./get-order";

export interface OrdersListResponse {
  data: OrderResponse[];
  meta: Meta;
}

export const getOrdersManage = async (
  page = 1,
  limit = 10
): Promise<OrdersListResponse> => {
  const response = await api.get("/orders", {
    params: { page, limit },
  });
  return response.data;
};

export const getOrdersManageQueryKey = (page: number, limit: number) => [
  "orders-manage",
  page,
  limit,
];

export const getOrdersManageQueryOptions = (page: number, limit: number) => {
  return queryOptions({
    queryKey: getOrdersManageQueryKey(page, limit),
    queryFn: () => getOrdersManage(page, limit),
  });
};

type UseGetOrdersManageParams = {
  queryConfig?: QueryConfig<typeof getOrdersManageQueryOptions>;
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
