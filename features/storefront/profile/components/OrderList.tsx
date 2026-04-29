"use client";

import React, { useState } from "react";
import { ProfileTabs } from "./ProfileTabs";
import { OrderItem } from "./OrderItem";
import { MOCK_ORDERS } from "../utils/mockData";

export type OrderStatusTab = "Tất cả" | "Chờ xác nhận" | "Đang giao" | "Hoàn thành" | "Đã hủy";
const ORDER_TABS: OrderStatusTab[] = ["Tất cả", "Chờ xác nhận", "Đang giao", "Hoàn thành", "Đã hủy"];

export const OrderList = () => {
  const [activeTab, setActiveTab] = useState<OrderStatusTab>("Tất cả");

  const filteredOrders = MOCK_ORDERS.filter((order) => {
    if (activeTab === "Tất cả") return true;
    if (activeTab === "Chờ xác nhận" || activeTab === "Đang giao") return order.status === "pending"; // Simple logic mapping mock data
    if (activeTab === "Hoàn thành") return order.status === "completed";
    if (activeTab === "Đã hủy") return order.status === "cancelled";
    return true;
  });

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
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => <OrderItem key={order.id} order={order} />)
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 shadow-sm">
            Không có đơn hàng nào.
          </div>
        )}
      </div>
    </div>
  );
};
