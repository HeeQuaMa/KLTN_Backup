"use client";

import React, { useCallback, useEffect, useState } from "react";
import { ProfileTabs } from "./ProfileTabs";
import { OrderItem } from "./OrderItem";
import {
  getMyOrders,
  mapMyOrderApiToOrderData,
  MY_ORDERS_STALE_STORAGE_KEY,
  type MyOrdersApiStatus,
} from "@/lib/api/orderApi";
import type { OrderData } from "../types/order";
import { toast } from "react-toastify";

export type OrderStatusTab = "Tất cả" | "Chờ xác nhận" | "Đang giao" | "Hoàn thành" | "Đã hủy";
const ORDER_TABS: OrderStatusTab[] = ["Tất cả", "Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"];

const TAB_TO_API_STATUS: Partial<Record<OrderStatusTab, MyOrdersApiStatus>> = {
  "Chờ xác nhận": "PENDING_CONFIRMATION",
  "Đang giao": "SHIPPING",
  "Hoàn thành": "COMPLETED",
  "Đã hủy": "CANCELLED",
};

export const OrderList = () => {
  const [activeTab, setActiveTab] = useState<OrderStatusTab>("Tất cả");
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const apiStatus = TAB_TO_API_STATUS[activeTab];
      const { orders: raw } = await getMyOrders(
        apiStatus != null ? { status: apiStatus } : {},
      );
      setOrders(raw.map(mapMyOrderApiToOrderData));
      try {
        sessionStorage.removeItem(MY_ORDERS_STALE_STORAGE_KEY);
      } catch {
        /* ignore */
      }
    } catch (e: unknown) {
      console.error(e);
      toast.error("Không tải được lịch sử đơn hàng. Bạn đã đăng nhập chưa?");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    void fetchOrders();
  }, [fetchOrders]);

  // Sau đặt hàng: refetch khi quay lại trang / tab (bfcache, nhiều tab).
  useEffect(() => {
    const maybeRefetch = () => {
      if (typeof window === "undefined") return;
      try {
        if (sessionStorage.getItem(MY_ORDERS_STALE_STORAGE_KEY) != null) {
          void fetchOrders();
        }
      } catch {
        /* ignore */
      }
    };
    window.addEventListener("focus", maybeRefetch);
    window.addEventListener("pageshow", maybeRefetch);
    return () => {
      window.removeEventListener("focus", maybeRefetch);
      window.removeEventListener("pageshow", maybeRefetch);
    };
  }, [fetchOrders]);

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Page Title */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[24px] font-bold text-heading">Lịch sử đơn hàng (O2O)</h1>
      </div>

      {/* Tabs */}
      <ProfileTabs tabs={ORDER_TABS} activeTab={activeTab} onChange={setActiveTab} />

      {/* List */}
      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex h-32 w-full items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 shadow-sm">
            Đang tải…
          </div>
        ) : orders.length > 0 ? (
          orders.map((order) => <OrderItem key={order.id} order={order} />)
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 shadow-sm">
            Không có đơn hàng nào.
          </div>
        )}
      </div>
    </div>
  );
};
