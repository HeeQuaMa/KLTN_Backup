import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { RecentOrderRow } from "@/lib/api/dashboardApi";
import { formatDashboardOrderTotal } from "@/features/super-admin/dashboard/utils/format";

function statusPillClass(status: string): string {
  const s = status === "PENDING" ? "PENDING_CONFIRMATION" : status;
  if (s === "COMPLETED") return "bg-green-100 text-green-600";
  if (s === "PENDING_CONFIRMATION") return "bg-orange-100 text-orange-600";
  if (s === "SHIPPING") return "bg-blue-100 text-blue-700";
  if (s === "CANCELLED") return "bg-gray-100 text-gray-600";
  return "bg-slate-100 text-slate-600";
}

function formatOrderDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("vi-VN");
}

export function RecentOrders({ orders }: { orders: RecentOrderRow[] }) {
  return (
    <Card className="col-span-1 border-none shadow-sm md:col-span-3 lg:col-span-4">
      <CardHeader>
        <CardTitle className="text-base font-bold">Đơn hàng mới nhất</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs text-slate-500 uppercase tracking-wider">
              <th className="pb-3 font-semibold">MÃ ĐƠN</th>
              <th className="pb-3 font-semibold">KHÁCH HÀNG</th>
              <th className="pb-3 font-semibold">NGÀY ĐẶT</th>
              <th className="pb-3 font-semibold">TỔNG TIỀN</th>
              <th className="pb-3 font-semibold">TRẠNG THÁI</th>
              <th className="pb-3 font-semibold">KÊNH</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-500">
                  Không có đơn hàng trong tháng đã chọn.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={`${order.orderCode}-${order.createdAt}`} className="border-b border-slate-50 last:border-0">
                  <td className="py-4 font-semibold text-blue-600">{order.orderCode}</td>
                  <td className="py-4 text-slate-700">{order.customerName}</td>
                  <td className="py-4 text-slate-700">{formatOrderDate(order.createdAt)}</td>
                  <td className="py-4 text-slate-700">{formatDashboardOrderTotal(order.totalAmount)}</td>
                  <td className="py-4">
                    <span
                      className={cn(
                        "rounded-md px-2.5 py-1 text-xs font-semibold",
                        statusPillClass(order.status),
                      )}
                    >
                      {order.statusLabel}
                    </span>
                  </td>
                  <td className="py-4 text-slate-700">{order.channelLabel}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
