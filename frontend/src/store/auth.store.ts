import { create } from "zustand";

export type Role = "user" | "technician" | "admin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  role: Role;
  phone: string;
  email?: string;
}

interface AuthState {
  token: string | null;
  role: Role | null;
  user: User | null;
  hydrated: boolean;

  setAuth: (token: string, user: User) => void;
  hydrate: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: null,
  role: null,
  user: null,
  hydrated: false,

  // ✅ SAVE TOKEN + USER
  setAuth: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", user.role);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      role: user.role,
      user,
    });
  },

  // ✅ RESTORE SESSION ON REFRESH
  hydrate: () => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") as Role | null;
    const userRaw = localStorage.getItem("user");

    set({
      token,
      role,
      user: userRaw ? JSON.parse(userRaw) : null,
      hydrated: true,
    });
  },

  // ✅ LOGOUT CLEAN
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");

    set({
      token: null,
      role: null,
      user: null,
      hydrated: true,
    });
  },
}));
