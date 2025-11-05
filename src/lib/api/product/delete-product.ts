import api from "@/src/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { MutationConfig, queryClient } from "../../react-query";
import { getProductsQueryKey } from "./get-products";

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

interface UseDeleteProductParams {
  mutationConfig?: MutationConfig<typeof deleteProduct>;
}

export const useDeleteProduct = (params: UseDeleteProductParams = {}) => {
  return useMutation({
    mutationFn: deleteProduct,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: getProductsQueryKey(),
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
