/**
 * Authentication state management using Zustand.
 * Handles user session, tokens, and auth actions.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { tokenStorage } from "@/lib/api";
import { authApi } from "@/lib/api";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: {
    name: string;
    phone: string;
    age: number;
    address?: string;
    password: string;
    preferred_language: string;
  }) => Promise<void>;
  logout: () => void;
  fetchProfile: () => Promise<void>;
  guestLogin: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      login: async (phone, password) => {
        set({ isLoading: true });
        try {
          const tokens = await authApi.login({ phone, password });
          tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);

          const user = await authApi.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (data) => {
        set({ isLoading: true });
        try {
          const tokens = await authApi.register(data);
          tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);

          const user = await authApi.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        tokenStorage.clearTokens();
        set({ user: null, isAuthenticated: false });
      },

      fetchProfile: async () => {
        try {
          const user = await authApi.getProfile();
          set({ user, isAuthenticated: true });
        } catch {
          set({ user: null, isAuthenticated: false });
          tokenStorage.clearTokens();
        }
      },

      guestLogin: async () => {
        set({ isLoading: true });
        try {
          // Use hardcoded guest credentials seeded in backend
          const tokens = await authApi.login({ 
            phone: "9999999999", 
            password: "password123" 
          });
          tokenStorage.setTokens(tokens.access_token, tokens.refresh_token);

          const user = await authApi.getProfile();
          set({ user, isAuthenticated: true, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          console.error("Guest login failed:", error);
        }
      },
    }),
    {
      name: "ss-auth-store",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
