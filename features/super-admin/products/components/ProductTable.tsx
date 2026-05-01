// features/super-admin/products/components/ProductTable.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product, extractSpecs } from "@/lib/api/productApi";

interface ProductTableProps {
  data: Product[];
  isLoading: boolean;
}

export function ProductTable({ data, isLoading }: ProductTableProps) {
  return (
    <div className="relative min-h-[400px] overflow-hidden rounded-xl bg-white shadow-sm">
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs tracking-wider text-slate-500 uppercase">
              <th className="px-6 py-4 font-semibold">SẢN PHẨM</th>
              <th className="px-6 py-4 font-semibold">DANH MỤC</th>
              <th className="px-6 py-4 font-semibold">GIÁ BÁN</th>
              <th className="px-6 py-4 font-semibold">TỒN KHO</th>
              <th className="px-6 py-4 font-semibold">
                THÔNG SỐ BUILD PC (AI)
              </th>
              <th className="px-6 py-4 text-right font-semibold">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            ) : (
              data.map((product) => {
                // Sử dụng hàm extractSpecs xịn xò bạn đã viết
                const specsString = extractSpecs(
                  product.specifications,
                  product.brand,
                );
                const badges =
                  specsString !== product.brand ? specsString.split(" / ") : [];

                return (
                  <tr
                    key={product._id}
                    className="transition-colors hover:bg-slate-50"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="max-h-full max-w-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="line-clamp-1 font-semibold text-blue-600">
                            {product.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            SKU: {product.sku}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {/* Hiển thị name của category đã được populate từ backend */}
                      {(product.category as any)?.name || "N/A"}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {new Intl.NumberFormat("vi-VN").format(
                        product.price || 0,
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "font-bold",
                          (product.totalStock || 0) > 10
                            ? "text-green-600"
                            : "text-red-600",
                        )}
                      >
                        {product.totalStock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {badges.map((badge, idx) => (
                          <span
                            key={idx}
                            className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-500"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {/* Nút Sửa */}
                        <Link
                          href={`/super-admin/products/edit/${product._id}`}
                        >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>

                        {/* Nút Xóa */}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded text-slate-400 transition-colors hover:bg-red-50 hover:text-red-600"
                          onClick={() => {
                            // Tạm thời log ra ID, phần làm Modal xác nhận xóa mình sẽ làm sau
                            console.log("Muốn xóa sản phẩm ID:", product._id);
                            alert(
                              `Bạn đang muốn xóa sản phẩm: ${product.name}`,
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
