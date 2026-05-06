import http from "@/lib/axiosInstance";
import { CartItem } from "@/store/useCartStore";
import { isValidMongoId } from "@/lib/utils";
import type { OrderData, OrderStatus } from "@/features/storefront/profile/types/order";

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

/** Payload gửi lên POST /sales/checkout (user lấy từ JWT, userId không bắt buộc) */
export interface CreateOrderPayload {
  userId?: string;
  items: {
    product: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
  customerInfo?: OrderCustomerInfo;
  channel?: "ONLINE" | "O2O";
}

/** Đơn hàng trả về từ backend */
export interface OrderResponse {
  _id: string;
  orderCode?: string;
  user: unknown;
  items: CreateOrderPayload["items"];
  totalAmount: number;
  status: string;
  channel?: string;
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

/** Đặt sau checkout để OrderList biết cần refetch khi user quay lại tab / trang. */
export const MY_ORDERS_STALE_STORAGE_KEY = "nettech:invalidateMyOrders";

export function markMyOrdersStale(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(MY_ORDERS_STALE_STORAGE_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

// ─── Purchase history: GET /orders/my-orders ─────────────────────────────────

export type MyOrdersApiStatus =
  | "PENDING_CONFIRMATION"
  | "SHIPPING"
  | "COMPLETED"
  | "CANCELLED";

export interface MyOrderLineApi {
  product?: string;
  quantity: number;
  price: number;
  productName?: string;
  variant?: string;
  imageUrl?: string;
}

export interface MyOrderApi {
  orderCode: string;
  createdAt: string;
  status: MyOrdersApiStatus | "PENDING";
  channel: "ONLINE" | "O2O";
  totalAmount: number;
  items: MyOrderLineApi[];
}

function formatOrderDateVi(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("vi-VN");
}

/** Map BE → OrderData (Profile / OrderItem). */
export function mapMyOrderApiToOrderData(o: MyOrderApi): OrderData {
  const statusMap: Record<string, OrderStatus> = {
    PENDING_CONFIRMATION: "pending",
    PENDING: "pending",
    SHIPPING: "shipping",
    COMPLETED: "completed",
    CANCELLED: "cancelled",
  };

  return {
    id: o.orderCode,
    createdAt: formatOrderDateVi(o.createdAt),
    status: statusMap[o.status] ?? "pending",
    totalAmount: o.totalAmount,
    isOTC: o.channel === "O2O",
    products: (o.items || []).map((it, i) => ({
      id: it.product ?? `line-${i}`,
      name: it.productName ?? "Sản phẩm",
      variant: it.variant ?? "—",
      quantity: it.quantity,
      price: it.price,
      imageUrl: it.imageUrl ?? "",
    })),
  };
}

export async function getMyOrders(params?: {
  status?: MyOrdersApiStatus;
}): Promise<{ orders: MyOrderApi[] }> {
  const response = await http.get<{ orders: MyOrderApi[] }>(
    "/orders/my-orders",
    {
      params:
        params?.status != null
          ? { status: params.status }
          : undefined,
    },
  );
  return response.data;
}

