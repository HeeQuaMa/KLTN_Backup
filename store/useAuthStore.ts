import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;
  name: string;
  phone?: string;
  email: string;
  gender?: "Nam" | "Nữ";
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

// Temporary mocked user to simulate default logged in state since we don't have a real register/login flow perfectly set up yet
const MOCK_USER: User = {
  id: "u1",
  name: "Nguyen Van A",
  phone: "0901***888",
  email: "nguyen.van.a@gmail.com",
  gender: "Nam",
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      // Set default mock data as requested for UI building
      isLoggedIn: true,
      user: MOCK_USER,

      login: (user) => set({ isLoggedIn: true, user }),
      logout: () => set({ isLoggedIn: false, user: null }),
      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "auth-storage", // stores state in localStorage under this key
    }
  )
);
