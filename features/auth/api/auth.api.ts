// features/auth/auth.api.ts (hoặc features/auth/api/auth.api.ts)
import axiosInstance from "@/lib/axiosInstance";
import { LoginFormData, RegisterFormData } from "@/features/shared/auth/utils/validation";

export const loginApi = async (data: LoginFormData) => {
  const response = await axiosInstance.post("/auth/login", {
    // Lưu ý chỗ này: Zod của bạn ghi là emailOrPhone,
    // nhưng backend NestJS nãy mình code đang nhận biến tên là "email".
    // Nên mình map nó lại cho khớp backend nhé:
    email: data.emailOrPhone,
    password: data.password,
  });
  return response.data;
};

export const registerApi = async (data: RegisterFormData) => {
  const response = await axiosInstance.post("/auth/register", {
    email: data.email,
    fullName: data.fullName,
    password: data.password,
    phone: data.phone,
    // Backend chưa có trường phone, nếu cần bạn có thể bổ sung vào UserSchema bên NestJS sau
  });
  return response.data;
};

export const getProfileApi = async () => {
  const response = await axiosInstance.get("/auth/profile");
  return response.data;
};
