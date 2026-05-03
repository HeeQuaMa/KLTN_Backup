import axiosInstance from "@/lib/axiosInstance";

export type AdminOrderTab = "all" | "pending" | "processing" | "completed";
export type AdminOrderChannel = "all" | "ONLINE" | "O2O";
export type AdminOrderDate = "all" | "today" | "week" | "month";

export interface AdminOrderStats {
  pendingOnline: number;
  packing: number;
  shipping: number;
  cancelled: number;
}

export interface AdminOrderRow {
  _id: string;
  orderCode: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  totalAmount: number;
  channel: "ONLINE" | "O2O";
  status: string;
}

export interface AdminOrdersResponse {
  stats: AdminOrderStats;
  orders: AdminOrderRow[];
}

export async function fetchAdminOrders(params: {
  tab: AdminOrderTab;
  channel: AdminOrderChannel;
  date: AdminOrderDate;
  q?: string;
}): Promise<AdminOrdersResponse> {
  const { data } = await axiosInstance.get<AdminOrdersResponse>("/orders/admin", {
    params: {
      tab: params.tab,
      channel: params.channel,
      date: params.date,
      q: params.q?.trim() || undefined,
    },
  });
  return data;
}

export async function patchOrderStatus(
  orderId: string,
  status: string,
): Promise<AdminOrderRow> {
  const { data } = await axiosInstance.patch<AdminOrderRow>(
    `/orders/${orderId}/status`,
    { status },
  );
  return data;
}
