import { Button } from "@/components/ui/button";
import { Globe, Store, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

const orders = [
  {
    id: "#NT-8894",
    date: "22/01 10:30",
    customerName: "Tran Van C",
    customerPhone: "0912345678",
    total: "32.990.000",
    source: "Website",
    status: "Chờ xác nhận",
  },
  {
    id: "#NT-8893",
    date: "22/01 09:15",
    customerName: "Nguyen Thi B",
    customerPhone: "0987654321",
    total: "5.400.000",
    source: "Website",
    status: "Đang đóng gói",
  },
  {
    id: "#POS-Q1-002",
    date: "22/01 08:45",
    customerName: "Khách lẻ",
    customerPhone: "--",
    total: "390.000",
    source: "Tại quầy Q.1",
    status: "Hoàn thành",
  },
  {
    id: "#NT-8890",
    date: "21/01 20:00",
    customerName: "Le Van D",
    customerPhone: "0999888777",
    total: "12.500.000",
    source: "Website",
    status: "Đã hủy",
  },
];

export function OrderTable() {
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
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold">
                  <span className={order.id.startsWith("#NT") ? "text-blue-600" : "text-slate-800"}>
                    {order.id}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{order.date}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">{order.customerName}</span>
                    <span className="text-xs text-slate-400">{order.customerPhone}</span>
                  </div>
                </td>
                <td className="px-6 py-4 font-bold text-slate-800">{order.total}</td>
                
                <td className="px-6 py-4">
                  {order.source === "Website" ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-600">
                      <Globe className="h-3 w-3" /> Website
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                      <Store className="h-3 w-3" /> {order.source}
                    </span>
                  )}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      {
                        "bg-yellow-100 text-yellow-700": order.status === "Chờ xác nhận",
                        "bg-blue-100 text-blue-700": order.status === "Đang đóng gói",
                        "bg-green-100 text-green-700": order.status === "Hoàn thành",
                        "bg-red-100 text-red-700": order.status === "Đã hủy",
                      }
                    )}
                  >
                    {order.status}
                  </span>
                </td>
                
                <td className="px-6 py-4 text-center">
                  {order.status === "Chờ xác nhận" ? (
                    <Button className="rounded-md bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
                      XỬ LÝ
                    </Button>
                  ) : (
                    <Button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-800 transition-colors">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
