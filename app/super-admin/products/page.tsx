"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Package, AlertTriangle, Settings, Check } from "lucide-react";
import { toast } from "react-toastify";

// Import API và các Interface chuẩn từ lib/api
import { getProducts, Product, Pagination } from "@/lib/api/productApi";

import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { ProductFilterBar } from "@/features/super-admin/products/components/ProductFilterBar";
import { ProductTable } from "@/features/super-admin/products/components/ProductTable";
import { AddProductCard } from "@/features/super-admin/products/components/AddProductCard";

export default function SuperAdminProductsPage() {
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
        isActive: isActive === "all" ? undefined : isActive === "true",
        limit: 10,
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
      
      {/* TODO: Thêm component Pagination ở đây nếu muốn phân trang đẹp */}
    </div>
  );
}