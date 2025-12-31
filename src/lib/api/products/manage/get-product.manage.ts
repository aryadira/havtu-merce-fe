import api from "@/src/lib/axios";
import { QueryConfig } from "@/src/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";

export interface ProductConfiguration {
  product_item_id: string;
  product_variation_option_id: string;
  product_variation_option: {
    id: string;
    product_variation_id: string;
    value: string;
    variation: {
      id: string;
      product_category_id: string;
      variation_name: string;
      created_at: string;
      updated_at: string;
    };
    created_at: string;
    updated_at: string;
  };
}

export interface ProductItem {
  id: string;
  product_id: string;
  sku: string;
  price: number;
  qty_in_stock: number;
  configurations: ProductConfiguration[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  created_at: string;
  updated_at: string;
}

export interface ProductCategory {
  id: string;
  parent_category_id: string | null;
  category_name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProductDetailResponse {
  id: string;
  user_id: string;
  product_category_id: string;
  name: string;
  description: string;
  is_active: boolean;
  items: ProductItem[];
  images: ProductImage[];
  category: ProductCategory;
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
