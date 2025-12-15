import api from "@/src/lib/axios";
import { CreateProductSchema } from "@/src/app/(admin)/products/schema";
import { MutationConfig, queryClient } from "../../../react-query";
import { useMutation } from "@tanstack/react-query";

interface UpdateProductResponse {
  id: string;
  products: CreateProductSchema;
}

export const updateProduct = async ({
  id,
  products,
}: UpdateProductResponse) => {
  const response = await api.patch(`/products/manage/${id}`, products);
  return response.data;
};

interface UseUpdateProductParams {
  mutationConfig?: MutationConfig<typeof updateProduct>;
}

export const useUpdateProduct = (params: UseUpdateProductParams = {}) => {
  return useMutation({
    mutationFn: updateProduct,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({
        queryKey: ["products-manage"],
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
