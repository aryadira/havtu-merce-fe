import { useMutation } from "@tanstack/react-query";
import api from "../../axios";
import { MutationConfig, queryClient } from "../../react-query";

export interface UpdateCartDTO {
  item_id: string;
  item_qty: number;
}

export const updateCartItem = async (data: UpdateCartDTO) => {
  const response = await api.patch(`/carts/${data.item_id}`, data);
  return response.data;
};

interface UseUpdateCartParams {
  mutationConfig?: MutationConfig<typeof updateCartItem>;
}

export const useUpdateCartItem = (params: UseUpdateCartParams = {}) => {
  return useMutation({
    mutationFn: updateCartItem,
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
