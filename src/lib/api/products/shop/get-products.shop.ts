import api from "@/src/lib/axios";
import { QueryConfig } from "@/src/lib/react-query";
import { Meta } from "@/src/types/meta";
import { ProductShop } from "@/src/types/product";
import { queryOptions, useQuery } from "@tanstack/react-query";

export interface ProductResponse {
  data: ProductShop[];
  meta: Meta;
}

export const getProductsShop = async (
  page = 1,
  limit = 10
): Promise<ProductResponse> => {
  const response = await api.get("/products/shop", {
    params: { page, limit },
  });
  return response.data;
};

export const getProductsShopQueryKey = (page: number, limit: number) => [
  "products-shop",
  page,
  limit,
];

export const getProductsShopQueryOptions = (page: number, limit: number) => {
  return queryOptions({
    queryKey: getProductsShopQueryKey(page, limit),
    queryFn: () => getProductsShop(page, limit),
  });
};

type UseGetProductsParams = {
  queryConfig?: QueryConfig<typeof getProductsShopQueryOptions>;
};

export const useGetProductsShop = (
  page: number,
  limit: number,
  params: UseGetProductsParams = {}
) => {
  return useQuery({
    ...getProductsShopQueryOptions(page, limit),
    ...params.queryConfig,
  });
};
