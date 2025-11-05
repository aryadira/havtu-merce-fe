import api from "@/src/lib/axios";
import { useAuthStore } from "@/src/stores/auth.store";
import { MutationConfig, queryClient } from "../../react-query";
import { useMutation } from "@tanstack/react-query";
import { getUserQueryKey } from "../users/get-user";
import { LoginSchema } from "@/src/app/(auth)/login/schema";

export const login = async (data: LoginSchema) => {
  const res = await api.post("/auth/login", data);
  const { token, refreshToken } = res.data;

  useAuthStore.getState().setTokens(token, refreshToken);

  return res.data;
};

interface UseLoginParams {
  mutationConfig?: MutationConfig<typeof login>;
}

export const useLogin = (params: UseLoginParams = {}) => {
  return useMutation({
    mutationFn: login,
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
