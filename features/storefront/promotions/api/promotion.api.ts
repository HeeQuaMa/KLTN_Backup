import http from "@/lib/axiosInstance";

export const promotionApi = {
  applyVoucher: async (payload: { code: string; orderValue: number }) => {
    const response = await http.post("/promotions/apply", payload);
    return response.data;
  },
};