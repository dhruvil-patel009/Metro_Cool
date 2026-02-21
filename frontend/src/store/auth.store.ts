import { create } from "zustand";
import { persist } from "zustand/middleware";

type User = {
  id: string;
  role: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  profile_photo?: string | null

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
    (set, get) => ({
      user: null,
      token: null,
      hydrated: false,

      /* ================= LOGIN ================= */
      login: (user, token) => {
          localStorage.setItem("accessToken", token); // ⭐ IMPORTANT
        set({
          user,
          token,
        });

        // ⭐ VERY IMPORTANT
        // store token separately so API can access before zustand loads
        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("token", token);
        }
      },

      /* ================= LOGOUT ================= */
      logout: () => {
        localStorage.removeItem("accessToken"); // ⭐ IMPORTANT
  localStorage.removeItem("auth-storage");
        set({
          user: null,
          token: null,
        });

        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("accessToken");
          localStorage.removeItem("token");
        }
      },

      /* ================= HYDRATE ================= */
      hydrate: () => {
        if (typeof window !== "undefined") {
          try {
            // read zustand persisted storage
            const raw = localStorage.getItem("auth-storage");

            if (raw) {
              const parsed = JSON.parse(raw);
              const token = parsed?.state?.token;

              // ⭐ restore accessToken after refresh
              if (token) {
                localStorage.setItem("accessToken", token);
              }
            }
          } catch (err) {
            console.error("Auth hydration failed", err);
          }
        }

        set({ hydrated: true });
      },
    }),
    {
      name: "auth-storage",

      // only persist user + token
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),

      // ⭐ runs automatically after refresh
      onRehydrateStorage: () => (state) => {
        state?.hydrate();
      },
    }
  )
);