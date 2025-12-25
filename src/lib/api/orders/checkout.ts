import api from "@/src/lib/axios";
import { MutationConfig, queryClient } from "@/src/lib/react-query";
import { useMutation } from "@tanstack/react-query";
import { getCartsQueryKey } from "../carts/get-carts";

export type CheckoutItemDto = {
  product_id: string;
  item_qty: number;
};

export type CheckoutOrderDto = {
  items?: CheckoutItemDto[];
};

export const checkout = async (data: CheckoutOrderDto) => {
  const res = await api.post("/orders/checkout", data);
  return res.data;
};

interface UseCheckoutParams {
  mutationConfig?: MutationConfig<typeof checkout>;
}

export const useCheckout = (params: UseCheckoutParams = {}) => {
  return useMutation({
    mutationFn: checkout,
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
