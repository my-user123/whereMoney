"use client";

import { create } from "zustand";
import type { AuthUser } from "@/types/api";
import { clearToken, setToken } from "@/lib/api/client";

type AuthState = {
  user: AuthUser | null;
  setAuth: (token: string, user: AuthUser) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setAuth: (token, user) => {
    setToken(token);
    set({ user });
  },
  logout: () => {
    clearToken();
    set({ user: null });
  }
}));
