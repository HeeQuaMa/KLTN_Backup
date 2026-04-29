import http from "@/lib/axios";
import { CartItem } from "@/store/useCartStore";

/** Payload gửi lên POST /cart/add */
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

/** Payload gửi lên PATCH /cart/update-quantity */
export interface CartUpdateQuantityPayload {
  userId: string;
  cartItemId: string;
  quantity: number;
}

/** Shape của Cart document trả về từ backend */
export interface CartResponse {
  _id: string;
  userId: string;
  items: {
    cartItemId: string;
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    configName?: string;
    sku?: string;
  }[];
}

/** Map item từ backend → CartItem của Zustand store */
export const mapApiItemToCartItem = (item: CartResponse["items"][number]): CartItem => ({
  id: item.productId,
  cartItemId: item.cartItemId,
  name: item.name,
  price: item.price,
  image: item.image,
  quantity: item.quantity,
  configName: item.configName,
  sku: item.sku,
});

export const cartApi = {
  /** GET /cart/:userId — Lấy giỏ hàng của user */
  getCart: async (userId: string): Promise<CartResponse> => {
    const response = await http.get<CartResponse>(`/cart/${userId}`);
    return response.data;
  },

  /** POST /cart/add — Thêm sản phẩm vào giỏ (hoặc tăng SL nếu đã có) */
  addToCart: async (payload: CartAddPayload): Promise<CartResponse> => {
    const response = await http.post<CartResponse>("/cart/add", payload);
    return response.data;
  },

  /** PATCH /cart/update-quantity — Cập nhật số lượng */
  updateQuantity: async (payload: CartUpdateQuantityPayload): Promise<CartResponse> => {
    const response = await http.patch<CartResponse>("/cart/update-quantity", payload);
    return response.data;
  },

  /** DELETE /cart/remove/:userId/:cartItemId — Xóa 1 sản phẩm */
  removeItem: async (userId: string, cartItemId: string): Promise<CartResponse> => {
    const response = await http.delete<CartResponse>(`/cart/remove/${userId}/${cartItemId}`);
    return response.data;
  },

  /** DELETE /cart/clear/:userId — Xóa toàn bộ giỏ (sau khi đặt hàng) */
  clearCart: async (userId: string): Promise<{ message: string }> => {
    const response = await http.delete<{ message: string }>(`/cart/clear/${userId}`);
    return response.data;
  },
};
