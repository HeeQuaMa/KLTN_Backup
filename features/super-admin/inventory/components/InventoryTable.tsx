"use client";

import { cn } from "@/lib/utils";

const mockInventoryData = [
  {
    id: 1,
    sku: "LT-AS-G16",
    name: "Asus ROG Strix G16",
    category: "Laptop",
    totalStock: 45,
    stockBreakdown: "(Q5: 2, Q1: 43)",
    importPrice: 28000000,
    sellPrice: 32990000,
    status: "Sẵn hàng",
  },
  {
    id: 2,
    sku: "KEY-K2-RED",
    name: "Keychron K2 Red Switch",
    category: "Bàn phím",
    totalStock: 0,
    stockBreakdown: "",
    importPrice: 1200000,
    sellPrice: 1890000,
    status: "Hết hàng",
  },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};

export function InventoryTable() {
  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-6 py-4">MÃ SKU</th>
              <th className="px-6 py-4">TÊN SẢN PHẨM</th>
              <th className="px-6 py-4">DANH MỤC</th>
              <th className="px-6 py-4">TỒN KHO (TỔNG)</th>
              <th className="px-6 py-4">GIÁ NHẬP / BÁN</th>
              <th className="px-6 py-4 text-right">TRẠNG THÁI</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {mockInventoryData.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-medium text-slate-600">
                  {item.sku}
                </td>
                <td className="px-6 py-4 font-bold text-slate-800">
                  {item.name}
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {item.category}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "font-bold text-base",
                        item.totalStock > 0 ? "text-slate-800" : "text-red-600"
                      )}
                    >
                      {item.totalStock}
                    </span>
                    {item.stockBreakdown && (
                      <span className="text-slate-400 text-xs">
                        {item.stockBreakdown}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-xs">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-500">
                      Nhập: <span className="font-medium text-slate-700">{formatCurrency(item.importPrice)}</span>
                    </span>
                    <span className="text-slate-500">
                      Bán: <span className="font-medium text-slate-700">{formatCurrency(item.sellPrice)}</span>
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
                        item.status === "Sẵn hàng"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      )}
                    >
                      <span
                        className={cn(
                          "h-1.5 w-1.5 rounded-full",
                          item.status === "Sẵn hàng" ? "bg-green-600" : "bg-red-600"
                        )}
                      ></span>
                      {item.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
