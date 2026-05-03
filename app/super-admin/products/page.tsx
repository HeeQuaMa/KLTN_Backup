"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Package, AlertTriangle, Settings } from "lucide-react";
import { toast } from "react-toastify";

// Import API và các Interface chuẩn từ lib/api
import { getProducts, Product, Pagination } from "@/lib/api/productApi";

import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { ProductFilterBar } from "@/features/super-admin/products/components/ProductFilterBar";
import { ProductTable } from "@/features/super-admin/products/components/ProductTable";
import { AddProductCard } from "@/features/super-admin/products/components/AddProductCard";

/** Giống storefront cũ (productsApi mặc định limit 300) — admin cần xem danh sách dài. */
const SUPER_ADMIN_PRODUCTS_LIMIT = 300;

function SuperAdminProductsContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Quản lý State dữ liệu
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. Lấy các params từ URL (để đồng bộ với FilterBar)
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const isActive = searchParams.get("isActive") || "";

  // 3. Hàm fetch data thực tế
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await getProducts({
        page,
        search,
        category,
        brand,
        // Chuyển đổi isActive từ string URL sang boolean nếu cần
        isActive:
          !isActive || isActive === "all"
            ? undefined
            : isActive === "true",
        limit: SUPER_ADMIN_PRODUCTS_LIMIT,
      });

      // Lưu ý: Backend trả về format { products, pagination }
      setProducts(response.products);
      setPagination(response.pagination);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Không thể kết nối đến server Backend");
    } finally {
      setLoading(false);
    }
  };

  // 4. Lắng nghe thay đổi URL để tự động fetch lại
  useEffect(() => {
    fetchProducts();
  }, [page, search, category, brand, isActive]);

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Danh sách sản phẩm (Master Data)
        </h1>
        <Link 
          href="/super-admin/products/create" 
          className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          + THÊM SẢN PHẨM
        </Link>
      </div>

      {/* Cards Row - Hiển thị số liệu thực từ Pagination */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="TỔNG SẢN PHẨM"
          value={pagination?.total.toLocaleString() || "0"}
          trend="none" 
          trendText=""
          icon={<Package className="h-4 w-4" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="SẮP HẾT HÀNG"
          value="15" // Chỗ này sau này bạn viết API /stats riêng để lấy
          icon={<AlertTriangle className="h-4 w-4" />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
        <StatCard
          title="LINH KIỆN BUILD PC"
          value="850"
          icon={<Settings className="h-4 w-4" />}
          iconBgColor="bg-slate-100"
          iconColor="text-slate-600"
        />
        <AddProductCard />
      </div>

      {/* Filter Bar - Tự cập nhật URL */}
      <ProductFilterBar />

      {/* Table - Nhận data thực và hiển thị */}
      <ProductTable data={products} isLoading={loading} />

      {pagination && pagination.pages > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-4 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
          <Link
            href={`${pathname}?${(() => {
              const p = new URLSearchParams(searchParams.toString());
              p.set("page", String(Math.max(1, page - 1)));
              return p.toString();
            })()}`}
            className={`font-semibold ${
              page <= 1
                ? "pointer-events-none text-slate-300"
                : "text-blue-600 hover:underline"
            }`}
            aria-disabled={page <= 1}
          >
            ← Trang trước
          </Link>
          <span>
            Trang <strong>{pagination.page}</strong> / {pagination.pages} (hiển thị{" "}
            {products.length} / {pagination.total} sản phẩm)
          </span>
          <Link
            href={`${pathname}?${(() => {
              const p = new URLSearchParams(searchParams.toString());
              p.set("page", String(Math.min(pagination.pages, page + 1)));
              return p.toString();
            })()}`}
            className={`font-semibold ${
              page >= pagination.pages
                ? "pointer-events-none text-slate-300"
                : "text-blue-600 hover:underline"
            }`}
            aria-disabled={page >= pagination.pages}
          >
            Trang sau →
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SuperAdminProductsPage() {
  return (
    <Suspense fallback={<div className="p-8">Đang tải...</div>}>
      <SuperAdminProductsContent />
    </Suspense>
  );
}