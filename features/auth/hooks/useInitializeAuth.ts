// features/auth/hooks/useInitializeAuth.ts
import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { getProfileApi } from "@/features/auth/api/auth.api";
import axiosInstance from "@/lib/axiosInstance";

export const useInitializeAuth = () => {
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout); // Giả sử store bạn có hàm logout

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token");
      
      if (token) {
        try {
          // Mang token lên Backend kiểm tra và lấy Profile
          const data = await getProfileApi();
          // Token hợp lệ -> Cập nhật lại Zustand store
          login(data.user); 
        } catch (error) {
          // Token hết hạn hoặc bị lỗi -> Xóa token và reset store
          console.error("Token không hợp lệ hoặc đã hết hạn");
          localStorage.removeItem("access_token");
          logout();
        }
      }
    };

    checkAuth();
  }, [login, logout]);
};

