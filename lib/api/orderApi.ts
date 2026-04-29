import http from "@/lib/axios";
import { CartItem } from "@/store/useCartStore";
import { isValidMongoId } from "@/lib/utils";

/** Thông tin khách hàng trong đơn hàng */
export interface OrderCustomerInfo {
  fullName: string;
  phone: string;
  email?: string;
  city: string;
  district: string;
  ward: string;
  addressDetail: string;
  paymentMethod: "COD" | "VNPAY" | "MOMO";
}

/** Payload gửi lên POST /sales/checkout */
export interface CreateOrderPayload {
  userId: string;
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  customerInfo?: OrderCustomerInfo;
}

/** Đơn hàng trả về từ backend */
export interface OrderResponse {
  _id: string;
  user: string;
  items: CreateOrderPayload["items"];
  totalAmount: number;
  status: string;
  createdAt: string;
}

/**
 * Map CartItem[] → items gửi lên backend.
 * Lọc bỏ mock items (ID không phải MongoDB ObjectId 24 ký tự).
 */
export const mapCartItemsToOrderItems = (
  cartItems: CartItem[],
): CreateOrderPayload["items"] =>
  cartItems
    .filter((item) => isValidMongoId(item.id))
    .map((item) => ({
      product: String(item.id),
      quantity: item.quantity,
      price: item.price,
    }));

/** Kiểm tra giỏ hàng có chứa sản phẩm mock không */
export const hasMockItems = (cartItems: CartItem[]): boolean =>
  cartItems.some((item) => !isValidMongoId(item.id));

/**
 * POST /sales/checkout
 * Tạo đơn hàng mới từ giỏ hàng + thông tin khách hàng.
 */
export const createOrder = async (
  payload: CreateOrderPayload,
): Promise<OrderResponse> => {
  const response = await http.post<OrderResponse>("/sales/checkout", payload);
  return response.data;
};
