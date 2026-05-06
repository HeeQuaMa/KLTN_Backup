"use client";

import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InventoryAdminRow } from "@/lib/api/inventoryApi";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};

export function InventoryTable(props: {
  rows: InventoryAdminRow[];
  loading: boolean;
}) {
  const { rows, loading } = props;

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
            {loading && rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <Loader2 className="inline h-6 w-6 animate-spin text-slate-400" />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                  Không có sản phẩm phù hợp.
                </td>
              </tr>
            ) : (
              rows.map((item) => (
                <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-slate-600">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    {item.name}
                  </td>
                  <td className="px-6 py-4 text-slate-500">
                    {item.categoryName}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          "font-bold text-base",
                          item.totalStock > 0 ? "text-slate-800" : "text-red-600",
                        )}
                      >
                        {item.totalStock}
                      </span>
                      {item.stockBreakdown ? (
                        <span className="text-slate-400 text-xs">
                          {item.stockBreakdown}
                        </span>
                      ) : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-500">
                        Nhập:{" "}
                        <span className="font-medium text-slate-700">
                          {formatCurrency(item.importPrice)}
                        </span>
                      </span>
                      <span className="text-slate-500">
                        Bán:{" "}
                        <span className="font-medium text-slate-700">
                          {formatCurrency(item.sellPrice)}
                        </span>
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
                            : "bg-red-100 text-red-700",
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            item.status === "Sẵn hàng" ? "bg-green-600" : "bg-red-600",
                          )}
                        />
                        {item.status}
                      </span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
