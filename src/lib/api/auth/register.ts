import { RegisterSchema } from "@/src/app/(auth)/register/schema";
import api from "@/src/lib/axios";
import { MutationConfig, queryClient } from "../../react-query";
import { useMutation } from "@tanstack/react-query";
import { getUserQueryKey } from "../users/get-user";

export const register = async (data: RegisterSchema) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

interface UseRegisterParams {
  mutationConfig?: MutationConfig<typeof register>;
}

export const useRegister = (params: UseRegisterParams = {}) => {
  return useMutation({
    mutationFn: register,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutationResult, context) => {
      queryClient.invalidateQueries({ queryKey: getUserQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutationResult,
        context
      );
    },
  });
};
