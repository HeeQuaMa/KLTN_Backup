import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

import { OrderData } from "../types/order";

interface OrderItemProps {
  order: OrderData;
}

export const OrderItem = ({ order }: OrderItemProps) => {
  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount).replace("₫", "đ");
  };

  const statusConfig = {
    pending: {
      label: "Đang xử lý",
      className: "bg-[#FFF8E1] text-[#F57F17]", // Yellow emphasis
    },
    completed: {
      label: "Hoàn thành",
      className: "bg-success/15 text-success", // Green emphasis
    },
    cancelled: {
      label: "Đã hủy",
      className: "bg-gray-100 text-gray-500", // Gray emphasis
    },
  };

  const currentStatus = statusConfig[order.status];

  return (
    <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex flex-col gap-3 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 font-semibold">
          <span className="text-[14px] text-heading">Đơn hàng #{order.id}</span>
          <span className="hidden text-gray-300 md:block">|</span>
          <span className="text-[14px] text-gray-500">Ngày đặt: {order.createdAt}</span>

          {order.isOTC && (
            <div className="ml-0 flex w-fit items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-[13px] font-bold text-primary md:ml-2">
              <ShoppingCart size={14} className="text-primary" /> Mua tại quầy
            </div>
          )}
        </div>

        <div className={`mt-2 flex w-fit items-center justify-center rounded-md px-4 py-1.5 text-[14px] font-bold md:mt-0 ${currentStatus.className}`}>
          {currentStatus.label}
        </div>
      </div>

      {/* Body: Products */}
      <div className="flex flex-col pt-4">
        {order.products.map((product) => (
          <div key={product.id} className="mb-4 flex gap-4 last:mb-0 pb-4 border-b border-gray-100">
            {/* Image placeholder */}
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-md bg-gray-100 border border-gray-100 relative">
              {product.imageUrl ? (
                <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
              ) : null}
            </div>

            {/* Info */}
            <div className="flex flex-1 flex-col md:flex-row md:justify-between">
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-bold text-heading">{product.name}</span>
                <span className="text-[13px] text-gray-500 font-medium">Phân loại: {product.variant}</span>
                <span className="text-[14px] font-bold text-heading mt-1">x{product.quantity}</span>
              </div>
              <div className="mt-2 text-right md:mt-0">
                <span className="text-[15px] font-bold text-destructive">{formatMoney(product.price)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-4 pt-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[14px] font-medium text-gray-500">Thành tiền:</span>
          <span className="text-[20px] font-bold text-destructive">{formatMoney(order.totalAmount)}</span>
        </div>

        <div className="flex items-center gap-3">
          {order.status === "pending" && (
            <>
              <Button variant="outline" className="h-9 font-bold text-heading hover:bg-gray-50 bg-white">
                Chi tiết
              </Button>
              <Button className="h-9 px-6 font-bold text-white shadow-sm hover:opacity-90">
                Theo dõi
              </Button>
            </>
          )}

          {order.status === "completed" && (
            <>
              <Button variant="outline" className="h-9 font-bold text-heading hover:bg-gray-50 bg-white">
                Xem hóa đơn
              </Button>
              <Button variant="outline" className="h-9 border-primary text-primary hover:bg-blue-50 bg-white font-bold">
                Mua lại
              </Button>
            </>
          )}

          {order.status === "cancelled" && (
            <Button variant="outline" className="h-9 border-primary text-primary hover:bg-blue-50 bg-white font-bold px-8">
              Mua lại
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
