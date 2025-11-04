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

export const getProductDetail = async (id: string) => {
  const response = await api.get<ProductDetailResponse>(`/products/${id}`);
  return response.data;
};

export const getProductDetailQueryKey = (id: string) => ["product", id];

export const getProductDetailQueryOptions = (id: string) => {
  return queryOptions({
    queryKey: getProductDetailQueryKey(id),
    queryFn: () => getProductDetail(id),
  });
};

interface UseGetProductDetailParams {
  queryConfig?: QueryConfig<typeof getProductDetailQueryOptions>;
  id: string;
}

export const useGetProductDetail = (params: UseGetProductDetailParams) => {
  return useQuery({
    ...getProductDetailQueryOptions(params.id),
    ...params.queryConfig,
  });
};
