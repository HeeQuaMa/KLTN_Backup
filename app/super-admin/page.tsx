"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { DollarSign, Package, User, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { DashboardChart } from "@/features/super-admin/dashboard/components/DashboardChart";
import { TopProducts } from "@/features/super-admin/dashboard/components/TopProducts";
import { RecentOrders } from "@/features/super-admin/dashboard/components/RecentOrders";
import {
  fetchDashboardStats,
  fetchRevenueChart,
  fetchTopProducts,
  fetchRecentOrders,
  type DashboardStats,
  type RevenueChartWeek,
  type TopProductRow,
  type RecentOrderRow,
} from "@/lib/api/dashboardApi";
import {
  buildMonthOptions,
  formatDashboardMoney,
} from "@/features/super-admin/dashboard/utils/format";

export default function SuperAdminPage() {
  console.log('Dashboard Rendering...');
  const monthOptions = useMemo(() => buildMonthOptions(18), []);
  const [sel, setSel] = useState(() => monthOptions[0] ?? { year: 2026, month: 1, label: "" });

  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [chartLoading, setChartLoading] = useState(true);
  const [topLoading, setTopLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [chartWeeks, setChartWeeks] = useState<RevenueChartWeek[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductRow[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrderRow[]>([]);

  const load = useCallback(async () => {
    setLoading(true);
    setStatsLoading(true);
    setChartLoading(true);
    setTopLoading(true);
    setOrdersLoading(true);

    const results = await Promise.allSettled([
      fetchDashboardStats(sel.year, sel.month),
      fetchRevenueChart(sel.year, sel.month),
      fetchTopProducts(sel.year, sel.month),
      fetchRecentOrders(sel.year, sel.month),
    ]);

    const [statsResult, chartResult, topResult, ordersResult] = results;
    console.log('Data fetched:', { statsResult, chartResult, topResult, ordersResult });

    if (statsResult.status === "fulfilled") {
      setStats(statsResult.value);
    } else {
      console.error(statsResult.reason);
      setStats(null);
    }

    if (chartResult.status === "fulfilled") {
      setChartWeeks(chartResult.value.weeks);
    } else {
      console.error(chartResult.reason);
      setChartWeeks([]);
    }

    if (topResult.status === "fulfilled") {
      setTopProducts(topResult.value);
    } else {
      console.error(topResult.reason);
      setTopProducts([]);
    }

    if (ordersResult.status === "fulfilled") {
      setRecentOrders(ordersResult.value);
    } else {
      console.error(ordersResult.reason);
      setRecentOrders([]);
    }

    if (results.some((result) => result.status === "rejected")) {
      toast.error("Một số dữ liệu dashboard không tải được, nhưng trang vẫn hiển thị.");
    }

    setStatsLoading(false);
    setChartLoading(false);
    setTopLoading(false);
    setOrdersLoading(false);
    setLoading(false);
  }, [sel.year, sel.month]);

  useEffect(() => {
    void load();
  }, [load]);

  const growthTrend = (pct: number): "up" | "down" =>
    pct >= 0 ? "up" : "down";

  if (loading && !stats && !chartWeeks.length && !topProducts.length && !recentOrders.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center p-8 text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading...
      </div>
    );
  }

  const triggerTestNotification = () => {
    const payload = {
      orderCode: `TEST-${Date.now()}`,
      totalPrice: 123456,
      customerName: "Demo Customer",
    };
    console.log('EVENT RECEIVED AT FRONTEND:', payload);
    toast.success("TEST NOTIFICATION TRIGGERED");
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Báo cáo doanh thu toàn hệ thống
        </h1>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={triggerTestNotification}
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
          >
            TEST NOTIFICATION
          </button>
          {loading && (
            <Loader2 className="h-5 w-5 animate-spin text-slate-400" aria-hidden />
          )}
          <select
            className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={`${sel.year}-${sel.month}`}
            onChange={(e) => {
              const opt = monthOptions.find(
                (o) => `${o.year}-${o.month}` === e.target.value,
              );
              if (opt) setSel(opt);
            }}
          >
            {monthOptions.map((o) => (
              <option key={`${o.year}-${o.month}`} value={`${o.year}-${o.month}`}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="DOANH THU TỔNG"
          value={stats ? formatDashboardMoney(stats.totalRevenue) : "—"}
          trend={stats ? growthTrend(stats.totalRevenueGrowthPercent) : "none"}
          trendText={
            stats
              ? `${Math.abs(stats.totalRevenueGrowthPercent)}% so với tháng trước`
              : undefined
          }
          icon={<DollarSign className="h-4 w-4" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
        />
        <StatCard
          title="TỔNG ĐƠN HÀNG"
          value={stats ? String(stats.totalOrders) : "—"}
          trend={stats ? growthTrend(stats.totalOrdersGrowthPercent) : "none"}
          trendText={
            stats
              ? `${Math.abs(stats.totalOrdersGrowthPercent)}% so với tháng trước`
              : undefined
          }
          icon={<Package className="h-4 w-4" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
        />
        <StatCard
          title="KHÁCH HÀNG MỚI"
          value={stats ? String(stats.newCustomers) : "—"}
          trend={stats ? growthTrend(stats.newCustomersGrowthPercent) : "none"}
          trendText={
            stats
              ? `${Math.abs(stats.newCustomersGrowthPercent)}% so với tháng trước`
              : undefined
          }
          icon={<User className="h-4 w-4" />}
          iconBgColor="bg-slate-100"
          iconColor="text-slate-600"
        />
        <StatCard
          title="SẢN PHẨM SẮP HẾT"
          value={stats ? String(stats.lowStockProducts) : "—"}
          trend="none"
          trendText={
            stats
              ? `Ngưỡng < ${stats.lowStockThreshold} — Cần nhập kho ngay`
              : undefined
          }
          icon={<AlertTriangle className="h-4 w-4" />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <DashboardChart weeks={chartWeeks} />
        <TopProducts products={topProducts} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <RecentOrders orders={recentOrders} />
      </div>
    </div>
  );
}
