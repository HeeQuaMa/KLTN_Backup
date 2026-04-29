"use client";

import { DollarSign, Package, User, AlertTriangle } from "lucide-react";
import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { DashboardChart } from "@/features/super-admin/dashboard/components/DashboardChart";
import { TopProducts } from "@/features/super-admin/dashboard/components/TopProducts";
import { RecentOrders } from "@/features/super-admin/dashboard/components/RecentOrders";

export default function SuperAdminPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Báo cáo doanh thu toàn hệ thống
        </h1>
        <div className="flex items-center">
          <select className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
            <option>Tháng này: 01/2026</option>
            <option>Tháng trước: 12/2025</option>
          </select>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="DOANH THU TỔNG"
          value="1.2 Tỷ"
          trend="up"
          trendText="12% so với tháng trước"
          icon={<DollarSign className="h-4 w-4" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="TỔNG ĐƠN HÀNG"
          value="850"
          trend="up"
          trendText="5% so với tháng trước"
          icon={<Package className="h-4 w-4" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="KHÁCH HÀNG MỚI"
          value="120"
          trend="down"
          trendText="2% so với tháng trước"
          icon={<User className="h-4 w-4" />}
          iconBgColor="bg-slate-100"
          iconColor="text-slate-600"
        />
        <StatCard
          title="SẢN PHẨM SẮP HẾT"
          value="15"
          trend="none"
          trendText="Cần nhập kho ngay"
          icon={<AlertTriangle className="h-4 w-4" />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      {/* Chart & Top Products */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <DashboardChart />
        <TopProducts />
      </div>

      {/* Recent Orders */}
      <div className="grid grid-cols-1 gap-6">
        <RecentOrders />
      </div>
    </div>
  );
}
