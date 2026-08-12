"use client";

import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string | null;
  orgId: string;
  org?: {
    id: string;
    name: string;
    slug: string;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setLoading: (loading: boolean) => void;
  isAuthenticated: () => boolean;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: true,

  login: (user: User, token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("hotflow-token", token);
    }
    set({ user, token, loading: false });
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("hotflow-token");
      document.cookie = "hotflow-token=; path=/; max-age=0";
    }
    set({ user: null, token: null, loading: false });
  },

  setUser: (user: User) => set({ user }),
  setToken: (token: string) => set({ token }),
  setLoading: (loading: boolean) => set({ loading }),

  isAuthenticated: () => {
    const { user, token } = get();
    return !!user && !!token;
  },

  checkAuth: async () => {
    try {
      set({ loading: true });
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        const token = get().token || (typeof window !== "undefined" ? localStorage.getItem("hotflow-token") : null);
        set({ user: data.user, token, loading: false });
      } else {
        if (typeof window !== "undefined") {
          localStorage.removeItem("hotflow-token");
        }
        set({ user: null, token: null, loading: false });
      }
    } catch {
      set({ loading: false });
    }
  },
}));
