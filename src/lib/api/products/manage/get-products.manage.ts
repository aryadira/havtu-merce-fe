import api from "@/src/lib/axios";
import { QueryConfig } from "@/src/lib/react-query";
import { Meta } from "@/src/types/meta";
import { queryOptions, useQuery } from "@tanstack/react-query";

export interface ProductItemResponse {
  id: string;
  name: string;
  is_active: boolean;
  items: [
    {
      id: string;
      price: number;
      qty_in_stock: number;
    }
  ];
  images: [
    {
      id: string;
      image_url: string;
    }
  ];
  category: {
    id: string;
    category_name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ProductResponse {
  data: ProductItemResponse[];
  meta: Meta;
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
  "products-manage",
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
