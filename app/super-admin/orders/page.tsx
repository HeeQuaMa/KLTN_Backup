"use client";

import { Button } from "@/components/ui/button";

import { Download, Bell, Package, Truck, X } from "lucide-react";
import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { OrderFilterBar } from "@/features/super-admin/orders/components/OrderFilterBar";
import { OrderTable } from "@/features/super-admin/orders/components/OrderTable";

export default function SuperAdminOrdersPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Quản lý đơn hàng (O2O Fulfillment)
        </h1>
        <Button className="flex items-center gap-2 rounded-md border border-green-600 px-4 py-2 text-sm font-semibold text-green-600 transition-colors hover:bg-green-50">
          XUẤT EXCEL
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="CHỜ XÁC NHẬN (ONLINE)"
          value="12"
          trend="none"
          trendText=""
          icon={<Bell className="h-4 w-4" />}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          valueColor="text-blue-600"
        />
        <StatCard
          title="ĐANG ĐÓNG GÓI"
          value="5"
          trend="none"
          trendText=""
          icon={<Package className="h-4 w-4" />}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
          valueColor="text-orange-500"
        />
        <StatCard
          title="ĐANG GIAO HÀNG"
          value="28"
          trend="none"
          trendText=""
          icon={<Truck className="h-4 w-4" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          valueColor="text-green-500"
        />
        <StatCard
          title="ĐƠN HỦY / TRẢ HÀNG"
          value="2"
          trend="none"
          trendText=""
          icon={<X className="h-4 w-4" />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          valueColor="text-red-600"
        />
      </div>

      {/* Filter Bar */}
      <OrderFilterBar />

      {/* Data Table */}
      <OrderTable />
    </div>
  );
}
