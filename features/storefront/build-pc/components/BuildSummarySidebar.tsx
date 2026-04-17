"use client";

import React from "react";
import { Button } from "@/components/ui/button";

export const BuildSummarySidebar = () => {
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
            <span>3/8</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span>Tổng công suất (Ước tính):</span>
              <span>350W</span>
            </div>
            <span className="text-primary italic">
              Gợi ý nguồn: 650W trở lên
            </span>
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* Pricing */}
        <div className="flex flex-col gap-1">
          <span className="text-foreground text-[18px] font-bold">
            Tổng tiền:
          </span>
          <span className="text-destructive text-[32px] leading-tight font-bold">
            20.290.000đ
          </span>
          <span className="text-muted-foreground text-[12px] font-medium">
            (Đã bao gồm VAT)
          </span>
        </div>

        {/* Actions */}
        <div className="mt-2 flex flex-col gap-3">
          <Button className="h-12 w-full rounded-md bg-[#e53e3e] text-[14px] font-bold text-white transition-colors hover:bg-[#c53030]">
            THÊM VÀO GIỎ HÀNG
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
              className="h-10 flex-1 rounded-md border-gray-400 text-[12px] font-bold text-gray-700 uppercase hover:bg-gray-50"
            >
              Làm mới
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
