import http from "@/lib/axios";

export const cartApi = {
  addToCart: async (data: {
    userId: string;
    productId: string;
    cartItemId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    configName: string;
    sku: string;
  }) => {
    const response = await http.post("/cart/add", data);
    return response.data;
  },
};
