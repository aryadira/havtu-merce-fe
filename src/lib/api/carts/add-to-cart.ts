import { useMutation } from "@tanstack/react-query";
import api from "../../axios";
import { MutationConfig, queryClient } from "../../react-query";

export interface AddToCartDTO {
  user_id?: string;
  product_id: string;
  item_qty: number;
  session_id?: string;
}

export const addToCart = async (data: AddToCartDTO) => {
  const response = await api.post("carts", data);
  return response.data;
};

interface UseAddToCartParams {
  mutationConfig?: MutationConfig<typeof addToCart>;
}

export const useAddToCart = (params: UseAddToCartParams = {}) => {
  return useMutation({
    mutationFn: addToCart,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["carts"] });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};
