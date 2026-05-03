import http from "@/lib/axios";

export const authApi = {
  register: async (data: { fullName: string; email: string; phone: string; password: string }) => {
    const response = await http.post("/auth/register", data);
    return response.data;
  },
  login: async (data: { emailOrPhone: string; password: string }) => {
    const response = await http.post("/auth/login", {
      emailOrPhone: data.emailOrPhone,
      password: data.password,
    });
    return response.data;
  },
};
