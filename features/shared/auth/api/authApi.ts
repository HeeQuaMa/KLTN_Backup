import http from "@/lib/axios";

export const authApi = {
  register: async (data: { fullName: string; email: string; phone: string; password: string }) => {
    const response = await http.post("/auth/register", data);
    return response.data;
  },
  login: async (data: { emailOrPhone: string; password: string }) => {
    const payload = {
      email: data.emailOrPhone.includes("@") ? data.emailOrPhone : undefined,
      phone: !data.emailOrPhone.includes("@") ? data.emailOrPhone : undefined,
      password: data.password,
    };
    
    // Xóa undefined properties
    const cleanPayload = Object.fromEntries(Object.entries(payload).filter(([_, v]) => v != null));

    const response = await http.post("/auth/login", cleanPayload);
    return response.data;
  },
};
