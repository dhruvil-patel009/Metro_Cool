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
        set({
          user,
          token,
        });

        if (typeof window !== "undefined") {
          localStorage.setItem("accessToken", token);
          localStorage.setItem("token", token);
          // Set cookie so Next.js middleware can check auth on server
          document.cookie = `accessToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        }
      },

      /* ================= LOGOUT ================= */
  //     logout: () => {
  //       localStorage.removeItem("accessToken"); // ⭐ IMPORTANT
  // localStorage.removeItem("auth-storage");
  //       set({
  //         user: null,
  //         token: null,
  //       });

  //       if (typeof window !== "undefined") {
  //         localStorage.removeItem("auth-storage");
  //         localStorage.removeItem("accessToken");
  //         localStorage.removeItem("token");
  //       }
  //     },

  logout: () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth-storage");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("token");
    // Clear the middleware cookie
    document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
  }

  set({
    user: null,
    token: null,
    hydrated: true,
  });
},
      /* ================= HYDRATE ================= */
      hydrate: () => {
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem("auth-storage")
            if (raw) {
              const parsed = JSON.parse(raw)
              const token = parsed?.state?.token
              // Restore accessToken so API calls before Zustand loads work
              if (token) {
                localStorage.setItem("accessToken", token)
              }
            }
          } catch (err) {
            console.error("Auth hydration failed", err)
          }
        }
        set({ hydrated: true })
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