import { LoginSchema } from "@/src/app/(auth)/login/schema";
import { RegisterSchema } from "@/src/app/(auth)/register/schema";
import { UserGender } from "@/src/app/(public)/profile/schema";
import api from "@/src/lib/axios";
import {
  MutationConfig,
  QueryConfig,
  queryClient,
} from "@/src/lib/react-query";
import { useAuthStore } from "@/src/stores/auth.store";
import { queryOptions, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

// --- Types ---
export interface CurrentUserResponse {
  id: string;
  user_role_id: string;
  role_slug: string;
  username: string;
  email: string;
  profile: {
    id: string;
    user_id: string;
    fullname: string;
    phone_number: string;
    avatar: string;
    birthdate: string;
    gender: UserGender;
  };
}

// --- Query Keys ---
export const getAuthUserQueryKey = () => ["auth-user"];

// --- API Functions ---
interface UseLoginParams {
  mutationConfig?: MutationConfig<typeof login>;
}

// --- Login ---
export const login = async (data: LoginSchema) => {
  // Clear any existing session first to avoid conflicts
  const { clearAuth } = useAuthStore.getState();
  clearAuth();

  const res = await api.post("/auth/login", data);
  const { token, refreshToken } = res.data;
  useAuthStore.getState().setTokens(token, refreshToken);
  return res.data;
};

export const useLogin = (params: UseLoginParams = {}) => {
  return useMutation({
    mutationFn: login,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: getAuthUserQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};

// --- Register ---
interface UseRegisterParams {
  mutationConfig?: MutationConfig<typeof register>;
}

export const register = async (data: RegisterSchema) => {
  const response = await api.post("/auth/register", data);
  return response.data;
};

export const useRegister = (params: UseRegisterParams = {}) => {
  return useMutation({
    mutationFn: register,
    ...params.mutationConfig,
    onSuccess: (data, variables, onMutateResult, context) => {
      queryClient.invalidateQueries({ queryKey: getAuthUserQueryKey() });
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};

// --- Logout ---
interface UseLogoutParams {
  mutationConfig?: MutationConfig<typeof logout>;
}

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

export const useLogout = (params: UseLogoutParams = {}) => {
  const router = useRouter();

  return useMutation({
    mutationFn: logout,
    ...params.mutationConfig,
    onSuccess: async (data, variables, onMutateResult, context) => {
      await queryClient.invalidateQueries({ queryKey: getAuthUserQueryKey() });
      router.push("/login");
      params.mutationConfig?.onSuccess?.(
        data,
        variables,
        onMutateResult,
        context
      );
    },
  });
};

// --- Me ---
interface UseMeParams {
  queryConfig?: QueryConfig<typeof meQueryOptions>;
}

export const me = async () => {
  const response = await api.get<CurrentUserResponse>("/auth/me");
  return response.data;
};

export const useMe = (params: UseMeParams = {}) => {
  return useQuery({
    ...meQueryOptions(),
    ...params.queryConfig,
  });
};

export const meQueryOptions = () => {
  return queryOptions({
    queryKey: getAuthUserQueryKey(),
    queryFn: me,
  });
};

// --- Hooks ---
export function useAuth() {
  const { token, refreshToken, setTokens, clearAuth } = useAuthStore();
  return { token, refreshToken, setTokens, clearAuth };
}
