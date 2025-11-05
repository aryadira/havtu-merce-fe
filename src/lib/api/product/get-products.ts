import api from "@/src/lib/axios";
import { QueryConfig } from "@/src/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export interface ProductItemResponse {
  id: string;
  name: string;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
}

export const getProducts = async (): Promise<ProductItemResponse[]> => {
  const response = await api.get("/products");
  return response.data;
};

export const getProductsQueryKey = () => ["products"];

export const getProductsQueryOptions = () => {
  return queryOptions({
    queryKey: getProductsQueryKey(),
    queryFn: getProducts,
  });
};

type UseGetProductsParams = {
  queryConfig?: QueryConfig<typeof getProductsQueryOptions>;
};

export const useGetProducts = (params: UseGetProductsParams = {}) => {
  return useQuery({
    ...getProductsQueryOptions(),
    ...params.queryConfig,
  });
};
