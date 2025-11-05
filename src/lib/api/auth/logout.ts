import { useMutation } from "@tanstack/react-query";
import { queryClient } from "../../react-query";
import { getUserQueryKey } from "../users/get-user";
import { useRouter } from "next/navigation";
import api from "@/src/lib/axios";
import { useAuthStore } from "@/src/stores/auth.store";
import { MutationConfig } from "../../react-query";

export const logout = async (): Promise<boolean> => {
  try {
    await api.post("/auth/logout");
  } catch (err) {
    console.warn("Logout API not implemented:", err);
  }

  const { clearAuth } = useAuthStore.getState();
  clearAuth();

  document.cookie = "token=; Max-Age=0; path=/;";
  document.cookie = "refreshToken=; Max-Age=0; path=/;";

  delete api.defaults.headers.common["Authorization"];

  return true;
};

interface UseLogoutParams {
  mutationConfig?: MutationConfig<typeof logout>;
}

export const useLogout = (params: UseLogoutParams = {}) => {
  const router = useRouter();

  return useMutation<boolean, Error, undefined>({
    mutationFn: logout,
    ...params.mutationConfig,
    onSuccess: async (data, variables, onMutationResult, context) => {
      await queryClient.invalidateQueries({ queryKey: getUserQueryKey() });
      router.push("/login");

      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutationResult,
        context
      );
    },
  });
};
