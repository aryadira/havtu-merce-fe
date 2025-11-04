import api from "@/src/lib/axios";
import { MutationConfig, queryClient } from "@/src/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { getProductsQueryKey } from "./getProducts";
import { CreateProductSchema } from "@/src/app/products/schema";

export const createProduct = async (products: CreateProductSchema) => {
  const response = await api.post("/products", products);
  return response.data;
};

interface UseCreateProductParams {
  mutationConfig?: MutationConfig<typeof createProduct>;
}

export const useCreateProduct = (params: UseCreateProductParams = {}) => {
  return useMutation({
    mutationFn: createProduct,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: getProductsQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};
