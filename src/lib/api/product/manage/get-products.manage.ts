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

export interface ProductResponse {
  data: ProductItemResponse[];
  meta: {
    totalItems: number;
    itemCount: number;
    totalPages: number | null;
    currentPage?: number;
  };
}

export const getProductsManage = async (
  page = 1,
  limit = 10
): Promise<ProductResponse> => {
  const response = await api.get("/products/manage", {
    params: { page, limit },
  });
  return response.data;
};

export const getProductsQueryKey = (page: number, limit: number) => [
  "products",
  page,
  limit,
];

export const getProductsQueryOptions = (page: number, limit: number) => {
  return queryOptions({
    queryKey: getProductsQueryKey(page, limit),
    queryFn: () => getProductsManage(page, limit),
  });
};

type UseGetProductsParams = {
  queryConfig?: QueryConfig<typeof getProductsQueryOptions>;
};

export const useGetProductsManage = (
  page: number,
  limit: number,
  params: UseGetProductsParams = {}
) => {
  return useQuery({
    ...getProductsQueryOptions(page, limit),
    ...params.queryConfig,
  });
};
