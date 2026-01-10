import api from "@/src/lib/axios";
import {
  MutationConfig,
  QueryConfig,
  queryClient,
} from "@/src/lib/react-query";
import { Cart } from "@/src/types/product";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";

// --- Types ---
export type CartResponse = Cart;

export interface AddToCartDTO {
  user_id?: string;
  product_id: string;
  item_qty: number;
  session_id?: string;
}

export interface UpdateCartDTO {
  item_id: string;
  item_qty: number;
}

// --- Query Keys ---
export const getCartsQueryKey = () => ["carts"];

// --- Get Carts ---
type UseGetCartsParams = {
  queryConfig?: QueryConfig<typeof getCartsQueryOptions>;
};

export const getCarts = async (): Promise<CartResponse> => {
  const response = await api.get("/carts");
  return response.data;
};

export const useGetCarts = (params: UseGetCartsParams = {}) => {
  return useQuery({
    ...getCartsQueryOptions(),
    ...params.queryConfig,
  });
};

export const getCartsQueryOptions = () => {
  return queryOptions({
    queryKey: getCartsQueryKey(),
    queryFn: () => getCarts(),
  });
};

// --- Add To Cart ---
interface UseAddToCartParams {
  mutationConfig?: MutationConfig<typeof addToCart>;
}

export const addToCart = async (data: AddToCartDTO) => {
  const response = await api.post("carts", data);
  return response.data;
};

export const useAddToCart = (params: UseAddToCartParams = {}) => {
  return useMutation({
    mutationFn: addToCart,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: getCartsQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};

// --- Update Cart Item ---
interface UseUpdateCartParams {
  mutationConfig?: MutationConfig<typeof updateCartItem>;
}

export const updateCartItem = async (data: UpdateCartDTO) => {
  const response = await api.patch(`/carts/${data.item_id}`, data);
  return response.data;
};

export const useUpdateCartItem = (params: UseUpdateCartParams = {}) => {
  return useMutation({
    mutationFn: updateCartItem,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: getCartsQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};

// --- Remove Cart Item ---
interface UseRemoveCartItemParams {
  mutationConfig?: MutationConfig<typeof removeCartItem>;
}

export const removeCartItem = async (id: string) => {
  const response = await api.delete(`/carts/${id}`);
  return response.data;
};

export const useRemoveCartItem = (params: UseRemoveCartItemParams = {}) => {
  return useMutation({
    mutationFn: removeCartItem,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: getCartsQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};
