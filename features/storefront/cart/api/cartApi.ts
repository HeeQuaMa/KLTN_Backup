import http from "@/lib/axios";

export interface CartAddPayload {
  userId: string;
  productId: string;
  cartItemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  configName?: string;
  sku?: string;
}

export interface CartUpdateQuantityPayload {
  userId: string;
  cartItemId: string;
  quantity: number;
}

export const cartApi = {
  getCart: async (userId: string) => {
    const response = await http.get(`/cart/${userId}`);
    return response.data;
  },

  addToCart: async (payload: CartAddPayload) => {
    const response = await http.post("/cart/add", payload);
    return response.data;
  },

  updateQuantity: async (payload: CartUpdateQuantityPayload) => {
    const response = await http.patch("/cart/update-quantity", payload);
    return response.data;
  },

  removeItem: async (userId: string, cartItemId: string) => {
    const response = await http.delete(`/cart/remove/${userId}/${cartItemId}`);
    return response.data;
  },

  clearCart: async (userId: string) => {
    const response = await http.delete(`/cart/clear/${userId}`);
    return response.data;
  },
};
