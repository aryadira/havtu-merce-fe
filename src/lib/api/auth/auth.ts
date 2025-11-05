import { useAuthStore } from "@/src/stores/auth.store";

export function useAuth() {
  const { token, refreshToken, setTokens, clearAuth } = useAuthStore();
  return { token, refreshToken, setTokens, clearAuth };
}
