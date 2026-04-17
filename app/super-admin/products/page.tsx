"use client";
import Link from "next/link";
import { useEffect } from "react";
import { Package, AlertTriangle, Settings, Check } from "lucide-react";
import { toast } from "react-toastify";
import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { ProductFilterBar } from "@/features/super-admin/products/components/ProductFilterBar";
import { ProductTable } from "@/features/super-admin/products/components/ProductTable";
import { AddProductCard } from "@/features/super-admin/products/components/AddProductCard";

export default function SuperAdminProductsPage() {
  // Simulate toast notification on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      toast.success("Đã đồng bộ tồn kho từ POS", {
        position: "bottom-right",
        theme: "dark",
        icon: <Check className="h-4 w-4 text-white" />,
        style: {
          backgroundColor: "#1e293b",
          color: "white",
          borderRadius: "8px",
        },
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Danh sách sản phẩm (Master Data)
        </h1>
        <Link href="/super-admin/products/create" className="text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">
          + THÊM SẢN PHẨM
        </Link>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="TỔNG SẢN PHẨM"
          value="1,240"
          trend="none"
          trendText=""
          icon={<Package className="h-4 w-4" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="SẮP HẾT HÀNG"
          value="15"
          trend="none"
          trendText=""
          icon={<AlertTriangle className="h-4 w-4" />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
        <StatCard
          title="LINH KIỆN BUILD PC"
          value="850"
          trend="none"
          trendText=""
          icon={<Settings className="h-4 w-4" />}
          iconBgColor="bg-slate-100"
          iconColor="text-slate-600"
        />
        <AddProductCard />
      </div>

      {/* Filter Bar */}
      <ProductFilterBar />

      {/* Data Table */}
      <ProductTable />
    </div>
  );
}
