import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const orders = [
  {
    id: "#NT-8892",
    customer: "Nguyen Van A",
    date: "22/01/2026",
    total: "36.030.000",
    status: "Chờ xử lý",
    statusColor: "bg-orange-100 text-orange-600",
    channel: "Website",
  },
  {
    id: "#POS-001",
    customer: "Khách lẻ",
    date: "22/01/2026",
    total: "390.000",
    status: "Hoàn thành",
    statusColor: "bg-green-100 text-green-600",
    channel: "Tại quầy (Q1)",
  },
];

export function RecentOrders() {
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
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-slate-50 last:border-0">
                <td className="py-4 font-semibold text-blue-600">{order.id}</td>
                <td className="py-4 text-slate-700">{order.customer}</td>
                <td className="py-4 text-slate-700">{order.date}</td>
                <td className="py-4 text-slate-700">{order.total}</td>
                <td className="py-4">
                  <span
                    className={cn(
                      "rounded-md px-2.5 py-1 text-xs font-semibold",
                      order.statusColor
                    )}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="py-4 text-slate-700">{order.channel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
