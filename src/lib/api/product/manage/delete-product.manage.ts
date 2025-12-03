import api from "@/src/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { MutationConfig, queryClient } from "../../../react-query";
import { getProductsQueryKey } from "./get-products.manage";

export const deleteProduct = async (id: string) => {
  const response = await api.delete(`/products/manage/${id}`);
  return response.data;
};

interface UseDeleteProductParams {
  page: number;
  limit: number;
  mutationConfig?: MutationConfig<typeof deleteProduct>;
}

export const useDeleteProduct = (params: UseDeleteProductParams) => {
  const { page, limit } = params;

  return useMutation({
    mutationFn: deleteProduct,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: getProductsQueryKey(page, limit),
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
