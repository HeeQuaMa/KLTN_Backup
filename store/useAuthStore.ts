import { create } from "zustand";

interface AuthState {
  isLoggedIn: boolean;
  user: any | null;
  login: (userData: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  login: (userData) => set({ isLoggedIn: true, user: userData }),
  logout: () => set({ isLoggedIn: false, user: null }),
}));
