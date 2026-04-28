"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface CreateVoucherModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type DiscountType = "percent" | "fixed";

export function CreateVoucherModal({
  open,
  onOpenChange,
}: CreateVoucherModalProps) {
  const [discountType, setDiscountType] = useState<DiscountType>("percent");
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log({
      code,
      discountType,
      discountValue,
      usageLimit,
      startDate,
      endDate,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="sm:max-w-[540px] p-0 gap-0 overflow-hidden rounded-xl border-none">
        {/* Header with blue gradient */}
        <div className="flex items-center justify-between bg-gradient-to-r from-[#1e3a5f] to-[#2563eb] px-6 py-4">
          <DialogTitle className="text-lg font-bold text-white">
            Thiết lập mã khuyến mãi mới
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="text-white/80 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Mã Voucher */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              Mã Voucher (Code) <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="VD: CHUC MUNG NAM MOI"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="h-11 bg-slate-50 border-slate-200 text-sm placeholder:text-slate-400"
              required
            />
          </div>

          {/* Loại giảm giá */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              Loại giảm giá
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDiscountType("percent")}
                className={cn(
                  "flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all",
                  discountType === "percent"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                    discountType === "percent"
                      ? "border-blue-500 bg-blue-500"
                      : "border-slate-300"
                  )}
                >
                  {discountType === "percent" && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
                Theo %
              </button>
              <button
                type="button"
                onClick={() => setDiscountType("fixed")}
                className={cn(
                  "flex items-center gap-3 rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all",
                  discountType === "fixed"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                )}
              >
                <span
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded-full border-2",
                    discountType === "fixed"
                      ? "border-blue-500 bg-blue-500"
                      : "border-slate-300"
                  )}
                >
                  {discountType === "fixed" && (
                    <span className="h-2 w-2 rounded-full bg-white" />
                  )}
                </span>
                Số tiền cố định
              </button>
            </div>
          </div>

          {/* Giá trị giảm */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              {discountType === "percent"
                ? "Giá trị giảm (%)"
                : "Giá trị giảm (VNĐ)"}
            </Label>
            <Input
              type="number"
              placeholder={discountType === "percent" ? "15" : "50000"}
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              className="h-11 bg-slate-50 border-slate-200 text-sm"
              min={0}
              max={discountType === "percent" ? 100 : undefined}
            />
          </div>

          {/* Giới hạn số lượt dùng */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              Giới hạn số lượt dùng
            </Label>
            <Input
              type="number"
              placeholder="100"
              value={usageLimit}
              onChange={(e) => setUsageLimit(e.target.value)}
              className="h-11 bg-slate-50 border-slate-200 text-sm"
              min={0}
            />
          </div>

          {/* Thời gian áp dụng */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold text-slate-700">
              Thời gian áp dụng
            </Label>
            <div className="grid grid-cols-2 gap-3 items-center">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="h-11 bg-slate-50 border-slate-200 text-sm"
              />
              <div className="flex items-center gap-3">
                <span className="text-slate-400 font-medium">-</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-11 bg-slate-50 border-slate-200 text-sm flex-1"
                />
              </div>
            </div>
          </div>

          {/* Submit button */}
          <Button
            type="submit"
            className="w-full h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base tracking-wider rounded-lg mt-2"
          >
            LƯU MÃ
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
