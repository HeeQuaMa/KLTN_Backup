"use client";

import { Button } from "@/components/ui/button";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getProducts } from "@/features/storefront/products/api/productsApi";
import { Product } from "@/features/storefront/products/utils/mockData";

export function ProductTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden min-h-[400px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">SẢN PHẨM</th>
              <th className="px-6 py-4 font-semibold">DANH MỤC</th>
              <th className="px-6 py-4 font-semibold">GIÁ BÁN</th>
              <th className="px-6 py-4 font-semibold">TỒN KHO</th>
              <th className="px-6 py-4 font-semibold">THÔNG SỐ BUILD PC (AI)</th>
              <th className="px-6 py-4 font-semibold text-right">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {!isLoading && products.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-500">
                  Không tìm thấy sản phẩm nào.
                </td>
              </tr>
            ) : (
              products.map((product) => {
                const badges = product.specs && product.specs !== "N/A" 
                  ? product.specs.split(" / ").filter(Boolean) 
                  : [];
                  
                return (
                  <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 overflow-hidden rounded-md bg-slate-100 flex-shrink-0 relative">
                          {product.image && (
                            <Image 
                              src={product.image} 
                              alt={product.name} 
                              fill
                              className="object-cover" 
                            />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-semibold text-blue-600 line-clamp-1">{product.name}</span>
                          <span className="text-xs text-slate-400">SKU: {product.sku || "N/A"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 capitalize">
                      {product.categorySlug === "cpu" ? "Vi xử lý (CPU)" : product.categorySlug}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800">
                      {new Intl.NumberFormat("vi-VN").format(product.price)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={cn(
                          "font-bold",
                          (product.totalStock || 0) > 10 ? "text-green-600" : "text-red-600"
                        )}
                      >
                        {product.totalStock || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {badges.map((badge, idx) => (
                          <span
                            key={idx}
                            className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-500 whitespace-nowrap"
                          >
                            {badge}
                          </span>
                        ))}
                        {badges.length === 0 && (
                          <span className="text-slate-400 italic text-xs">Không có thông số</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors">
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
