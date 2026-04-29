"use client";

import React from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BuildSummarySidebarProps {
  totalPrice: number;
  selectedCount: number;
  totalSlots: number;
  onAddToCart: () => void;
  onReset: () => void;
  isAddingToCart: boolean;
}

// Ước tính công suất tiêu thụ theo số linh kiện (đơn giản hoá)
function estimatePower(count: number): { usage: number; recommended: number } {
  const base = 50 + count * 45;
  const recommended = base < 350 ? 550 : base < 500 ? 650 : 850;
  return { usage: base, recommended };
}

export const BuildSummarySidebar = ({
  totalPrice,
  selectedCount,
  totalSlots,
  onAddToCart,
  onReset,
  isAddingToCart,
}: BuildSummarySidebarProps) => {
  const { usage, recommended } = estimatePower(selectedCount);

  return (
    <div className="border-border sticky top-6 flex w-full shrink-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm lg:w-[320px] xl:w-90">
      {/* Header */}
      <div className="bg-heading px-5 py-4">
        <h2 className="text-[16px] font-bold text-white">Chi phí dự tính</h2>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-6 p-5">
        {/* Stats */}
        <div className="flex flex-col gap-3 text-[13px] font-semibold text-gray-700">
          <div className="flex items-center justify-between">
            <span>Số lượng linh kiện:</span>
            <span className={selectedCount > 0 ? "text-primary" : "text-gray-400"}>
              {selectedCount}/{totalSlots}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span>Tổng công suất (Ước tính):</span>
              <span>{usage}W</span>
            </div>
            <span className="text-primary italic">
              Gợi ý nguồn: {recommended}W trở lên
            </span>
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* Pricing */}
        <div className="flex flex-col gap-1">
          <span className="text-foreground text-[18px] font-bold">
            Tổng tiền:
          </span>
          {totalPrice > 0 ? (
            <span className="text-destructive text-[30px] leading-tight font-bold">
              {new Intl.NumberFormat("vi-VN").format(totalPrice)}đ
            </span>
          ) : (
            <span className="text-gray-300 text-[20px] font-bold">
              —
            </span>
          )}
          <span className="text-muted-foreground text-[12px] font-medium">
            (Đã bao gồm VAT)
          </span>
        </div>

        {/* Actions */}
        <div className="mt-2 flex flex-col gap-3">
          <Button
            onClick={onAddToCart}
            disabled={selectedCount === 0 || isAddingToCart}
            className="h-12 w-full rounded-md bg-[#e53e3e] text-[14px] font-bold text-white transition-colors hover:bg-[#c53030] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAddingToCart ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang thêm...
              </span>
            ) : (
              "THÊM VÀO GIỎ HÀNG"
            )}
          </Button>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="h-10 flex-1 rounded-md border-gray-400 text-[12px] font-bold text-gray-700 uppercase hover:bg-gray-50"
            >
              Tải file PDF
            </Button>
            <Button
              variant="outline"
              onClick={onReset}
              disabled={selectedCount === 0}
              className="h-10 flex-1 rounded-md border-gray-400 text-[12px] font-bold text-gray-700 uppercase hover:bg-gray-50 disabled:opacity-40"
            >
              Làm mới
            </Button>
          </div>
        </div>

        {/* Progress bar */}
        {selectedCount > 0 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between text-[11px] text-gray-500 font-medium">
              <span>Hoàn thiện cấu hình</span>
              <span>{Math.round((selectedCount / totalSlots) * 100)}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-primary transition-all duration-500"
                style={{ width: `${(selectedCount / totalSlots) * 100}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
