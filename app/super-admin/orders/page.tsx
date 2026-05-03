"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Bell, Package, Truck, X } from "lucide-react";
import { toast } from "react-toastify";
import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { OrderFilterBar } from "@/features/super-admin/orders/components/OrderFilterBar";
import {
  OrderTable,
  nextApiStatus,
} from "@/features/super-admin/orders/components/OrderTable";
import {
  fetchAdminOrders,
  patchOrderStatus,
  type AdminOrderChannel,
  type AdminOrderDate,
  type AdminOrderRow,
  type AdminOrderStats,
  type AdminOrderTab,
} from "@/lib/api/adminOrdersApi";

export default function SuperAdminOrdersPage() {
  const [tab, setTab] = useState<AdminOrderTab>("all");
  const [channel, setChannel] = useState<AdminOrderChannel>("all");
  const [date, setDate] = useState<AdminOrderDate>("today");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [stats, setStats] = useState<AdminOrderStats | null>(null);
  const [orders, setOrders] = useState<AdminOrderRow[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const load = useCallback(async () => {
    try {
      const data = await fetchAdminOrders({
        tab,
        channel,
        date,
        q: debouncedSearch,
      });
      setStats(data.stats);
      setOrders(data.orders);
    } catch (e) {
      console.error(e);
      toast.error("Không tải được danh sách đơn (cần quyền Super Admin).");
      setStats(null);
      setOrders([]);
    }
  }, [tab, channel, date, debouncedSearch]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleAdvance = async (order: AdminOrderRow) => {
    const next = nextApiStatus(order.status);
    if (!next) return;
    try {
      await patchOrderStatus(order._id, next);
      toast.success("Đã cập nhật trạng thái đơn.");
      await load();
    } catch (e) {
      console.error(e);
      toast.error("Không cập nhật được trạng thái.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Quản lý đơn hàng (O2O Fulfillment)
        </h1>
        <Button
          type="button"
          className="flex items-center gap-2 rounded-md border border-green-600 px-4 py-2 text-sm font-semibold text-green-600 transition-colors hover:bg-green-50"
          onClick={() =>
            console.log("[XUẤT EXCEL] filters:", {
              tab,
              channel,
              date,
              search: debouncedSearch,
            })
          }
        >
          XUẤT EXCEL
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="CHỜ XÁC NHẬN (ONLINE)"
          value={stats != null ? String(stats.pendingOnline) : "—"}
          trend="none"
          trendText=""
          icon={<Bell className="h-4 w-4" />}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          valueColor="text-blue-600"
        />
        <StatCard
          title="ĐANG ĐÓNG GÓI"
          value={stats != null ? String(stats.packing) : "—"}
          trend="none"
          trendText=""
          icon={<Package className="h-4 w-4" />}
          iconBgColor="bg-orange-100"
          iconColor="text-orange-600"
          valueColor="text-orange-500"
        />
        <StatCard
          title="ĐANG GIAO HÀNG"
          value={stats != null ? String(stats.shipping) : "—"}
          trend="none"
          trendText=""
          icon={<Truck className="h-4 w-4" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          valueColor="text-green-500"
        />
        <StatCard
          title="ĐƠN HỦY / TRẢ HÀNG"
          value={stats != null ? String(stats.cancelled) : "—"}
          trend="none"
          trendText=""
          icon={<X className="h-4 w-4" />}
          iconBgColor="bg-red-100"
          iconColor="text-red-600"
          valueColor="text-red-600"
        />
      </div>

      {/* Filter Bar */}
      <OrderFilterBar
        search={search}
        onSearchChange={setSearch}
        tab={tab}
        onTab={setTab}
        channel={channel}
        onChannel={setChannel}
        date={date}
        onDate={setDate}
      />

      {/* Data Table */}
      <OrderTable orders={orders} onAdvance={handleAdvance} />
    </div>
  );
}
