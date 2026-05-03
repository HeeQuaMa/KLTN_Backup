import { Button } from "@/components/ui/button";
import { Globe, Store, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AdminOrderRow } from "@/lib/api/adminOrdersApi";

export function apiStatusToLabel(status: string): string {
  if (status === "PENDING" || status === "PENDING_CONFIRMATION")
    return "Chờ xác nhận";
  if (status === "PACKING") return "Đang đóng gói";
  if (status === "SHIPPING") return "Đang giao hàng";
  if (status === "COMPLETED") return "Hoàn thành";
  if (status === "CANCELLED") return "Đã hủy";
  return status;
}

export function nextApiStatus(status: string): string | null {
  if (status === "PENDING" || status === "PENDING_CONFIRMATION") return "PACKING";
  if (status === "PACKING") return "SHIPPING";
  if (status === "SHIPPING") return "COMPLETED";
  return null;
}

function formatOrderDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const day = String(d.getDate()).padStart(2, "0");
  const mon = String(d.getMonth() + 1).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const m = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${mon} ${h}:${m}`;
}

export type OrderTableProps = {
  orders: AdminOrderRow[];
  onAdvance: (order: AdminOrderRow) => void;
};

export function OrderTable({ orders, onAdvance }: OrderTableProps) {
  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">MÃ ĐƠN</th>
              <th className="px-6 py-4 font-semibold">NGÀY ĐẶT</th>
              <th className="px-6 py-4 font-semibold">KHÁCH HÀNG</th>
              <th className="px-6 py-4 font-semibold">TỔNG TIỀN</th>
              <th className="px-6 py-4 font-semibold">NGUỒN ĐƠN (O2O)</th>
              <th className="px-6 py-4 font-semibold">TRẠNG THÁI</th>
              <th className="px-6 py-4 font-semibold text-center">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => {
              const statusLabel = apiStatusToLabel(order.status);
              const displayCode = order.orderCode.replace(/^#/, "");
              const isNtStyle = /\bNT-/i.test(order.orderCode);
              const sourceLabel =
                order.channel === "ONLINE" ? "Website" : "Tại quầy Q.1";
              const next = nextApiStatus(order.status);
              return (
                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-semibold">
                    <span
                      className={
                        isNtStyle ? "text-blue-600" : "text-slate-800"
                      }
                    >
                      {order.orderCode.startsWith("#")
                        ? order.orderCode
                        : `#${displayCode}`}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {formatOrderDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">
                        {order.customerName}
                      </span>
                      <span className="text-xs text-slate-400">
                        {order.customerPhone}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {Math.round(order.totalAmount).toLocaleString("vi-VN")}
                  </td>

                  <td className="px-6 py-4">
                    {sourceLabel === "Website" ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                        <Globe className="h-3 w-3" /> Website
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                        <Store className="h-3 w-3" /> {sourceLabel}
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                        {
                          "bg-yellow-100 text-yellow-700":
                            statusLabel === "Chờ xác nhận",
                          "bg-blue-100 text-blue-700":
                            statusLabel === "Đang đóng gói" ||
                            statusLabel === "Đang giao hàng",
                          "bg-green-100 text-green-700":
                            statusLabel === "Hoàn thành",
                          "bg-red-100 text-red-700":
                            statusLabel === "Đã hủy",
                        },
                      )}
                    >
                      {statusLabel}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-center">
                    {statusLabel === "Chờ xác nhận" ? (
                      <Button
                        type="button"
                        className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
                        onClick={() => onAdvance(order)}
                      >
                        XỬ LÝ
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors"
                        onClick={() => {
                          if (next) onAdvance(order);
                        }}
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
