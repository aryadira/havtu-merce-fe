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

        document.cookie = `token=${token}; path=/; max-age=3600;`;
        document.cookie = `refreshToken=${refreshToken}; path=/; max-age=604800;`;
      },

      clearAuth: () => {
        set({ token: null, refreshToken: null });
        document.cookie = "token=; Max-Age=0; path=/;";
        document.cookie = "refreshToken=; Max-Age=0; path=/;";
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
