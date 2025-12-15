import api from "@/src/lib/axios";
import { QueryConfig } from "@/src/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

interface ProductDetailResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const getProduct = async (id: string) => {
  const response = await api.get<ProductDetailResponse>(
    `/products/manage/${id}`
  );
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
