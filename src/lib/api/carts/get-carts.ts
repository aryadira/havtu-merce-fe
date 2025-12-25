import api from "../../axios";
import { Meta } from "@/src/types/meta";
import { Cart } from "@/src/types/product";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { QueryConfig } from "../../react-query";

export type CartResponse = Cart;

export const getCarts = async (): Promise<CartResponse> => {
  const response = await api.get("/carts");
  return response.data;
};

export const getCartsQueryKey = () => ["carts"];

export const getCartsQueryOptions = () => {
  return queryOptions({
    queryKey: getCartsQueryKey(),
    queryFn: () => getCarts(),
  });
};

type UseGetCartsParams = {
  queryConfig?: QueryConfig<typeof getCartsQueryOptions>;
};

export const useGetCarts = (params: UseGetCartsParams = {}) => {
  return useQuery({
    ...getCartsQueryOptions(),
    ...params.queryConfig,
  });
};
