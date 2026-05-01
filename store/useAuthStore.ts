import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: string;        // Bạn đang thiếu trường này trong hình
  fullName: string;  // Bạn đang thiếu trường này trong hình
  email: string;
  role: string;
  phone?: string;
  gender?: "Nam" | "Nữ";
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  access_token: string | null; // Đã thêm
  login: (data: User & { access_token: string }) => void;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isLoggedIn: false,
      user: null,
      access_token: null, // PHẢI CÓ dòng này để khởi tạo giá trị mặc định

      login: (data) => {
        // Tách access_token ra khỏi data, phần còn lại là thông tin user
        const { access_token, ...userData } = data;
        set({
          isLoggedIn: true,
          user: userData,
          access_token: access_token,
        });
      },

      logout: () =>
        set({
          isLoggedIn: false,
          user: null,
          access_token: null, // Reset cả token khi logout
        }),

      updateUser: (data) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...data } : null,
        })),
    }),
    {
      name: "auth-storage", // Lưu vào localStorage dưới key này
    }
  )
);