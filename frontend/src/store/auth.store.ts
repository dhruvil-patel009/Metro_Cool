import { create } from "zustand";

export type Role = "user" | "technician" | "admin";

interface AuthState {
  token: string | null;
  role: Role | null;
  hydrated: boolean;

  setAuth: (token: string, role: Role) => void;
  hydrate: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  hydrated: false,

  setAuth: (token, role) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    set({ token, role });
  },

  hydrate: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as Role | null;

    set({
      token,
      role,
      hydrated: true
    });
  },

  logout: () => {
    // 🔥 CLEAR EVERYTHING AUTH-RELATED
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("refreshToken");

    set({
      token: null,
      role: null,
      hydrated: true
    });
  }
}));
