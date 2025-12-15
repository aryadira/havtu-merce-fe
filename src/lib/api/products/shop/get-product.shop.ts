import api from "@/src/lib/axios";
import { QueryConfig } from "@/src/lib/react-query";
import { ProductShop } from "@/src/types/product";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getProduct = async (id: string) => {
  const response = await api.get<ProductShop>(`/products/manage/${id}`);
  return response.data;
};

export const getProductQueryKey = (id: string) => ["product", id];

export const getProductQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: getProductQueryKey(id),
    queryFn: () => getProduct(id),
  });
};

interface UseGetProductParams {
  queryConfig?: QueryConfig<typeof getProductQueryOptions>;
  id: string;
}

export const useGetProduct = (params: UseGetProductParams) => {
  return useQuery({
    ...getProductQueryOptions(params.id),
    ...params.queryConfig,
  });
};
