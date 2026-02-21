import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  role: string;
  firstName?: string;
  lastName?: string;
};

type AuthState = {
  user: User | null;
  token: string | null;
  hydrated: boolean;

  login: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      hydrated: false,

      login: (user, token) => {
        set({
          user,
          token,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
        });
        localStorage.removeItem("auth-storage");
      },

      hydrate: () => set({ hydrated: true }),
    }),
    {
      name: "auth-storage",

      // ⭐⭐⭐ THIS IS THE IMPORTANT PART
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),

      onRehydrateStorage: () => (state) => {
        state?.hydrate();
      },
    }
  )
);