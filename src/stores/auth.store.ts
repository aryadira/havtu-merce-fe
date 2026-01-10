"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  setTokens: (token: string, refreshToken: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,

      setTokens: (token, refreshToken) => {
        set({ token, refreshToken });

        document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Lax`;
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800; SameSite=Lax`;
      },

      clearAuth: () => {
        set({ token: null, refreshToken: null });
        document.cookie =
          "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Max-Age=0";
        document.cookie =
          "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; Max-Age=0";
      },
    }),
    {
      name: process.env.NEXT_PUBLIC_AUTH_STORE_KEY || "auth-store",
      storage:
        typeof window !== "undefined"
          ? createJSONStorage(() => localStorage)
          : undefined,
    }
  )
);
