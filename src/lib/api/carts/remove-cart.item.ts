import api from "@/src/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { MutationConfig, queryClient } from "../../react-query";

export const removeCartItem = async (id: string) => {
  const response = await api.delete(`/carts/${id}`);
  return response.data;
};

interface UseRemoveCartItemParams {
  mutationConfig?: MutationConfig<typeof removeCartItem>;
}

export const useRemoveCartItem = (params: UseRemoveCartItemParams) => {
  return useMutation({
    mutationFn: removeCartItem,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: ["carts"],
      });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};
