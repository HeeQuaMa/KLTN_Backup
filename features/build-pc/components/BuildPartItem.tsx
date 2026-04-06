"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Check, Edit2, X } from "lucide-react";

export interface BuildPartProps {
  categoryKey: string;
  categoryLabel: string; // "CPU", "Mainboard", "VGA"...
  emptyLabel: string; // "Vui lòng chọn Card màn hình"
  buttonString: string; // "CHỌN VGA"
  filledData?: {
    id: string | number;
    name: string;
    specs: string;
    price: number | string;
    image?: any;
    inStock?: boolean;
  };
  onSelect?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
}

export const BuildPartItem = ({
  categoryLabel,
  emptyLabel,
  buttonString,
  filledData,
  onSelect,
  onEdit,
  onRemove,
}: BuildPartProps) => {
  const isEmpty = !filledData;

  // Format price if it's a number
  const formattedPrice =
    filledData && typeof filledData.price === "number"
      ? new Intl.NumberFormat("vi-VN").format(filledData.price) + "đ"
      : filledData?.price;

  return (
    <div
      className={cn(
        "flex min-h-24 w-full overflow-hidden rounded-lg border bg-white transition-all",
        isEmpty
          ? "border-dashed border-gray-300"
          : "hover:border-primary/50 border-solid border-gray-200 shadow-sm",
      )}
    >
      {/* Left Box (Category Name) */}
      <div className="flex w-24 shrink-0 flex-col items-center justify-center border-r border-gray-100 bg-gray-50 p-2 text-center md:w-32 md:p-4">
        <span className="text-[12px] font-bold text-gray-800 uppercase md:text-[13px]">
          {categoryLabel}
        </span>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col items-start justify-between gap-4 p-4 md:flex-row md:items-center">
        {isEmpty ? (
          <>
            {/* Empty State */}
            <div className="flex-1">
              <span className="text-muted-foreground text-[14px] italic">
                {emptyLabel}
              </span>
            </div>
            <Button
              onClick={onSelect}
              className="h-10 w-full rounded-md px-6 text-[13px] font-bold text-white md:w-auto"
            >
              {buttonString}
            </Button>
          </>
        ) : (
          <>
            {/* Filled State */}
            <div className="flex flex-1 items-center gap-4">
              <div className="h-16 w-16 shrink-0 rounded-md bg-gray-200 shadow-inner">
                {/* Image Placeholder */}
                {filledData.image && (
                  <img
                    src={filledData.image.src || filledData.image}
                    alt={filledData.name}
                    className="h-full w-full rounded-md object-cover"
                  />
                )}
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-primary line-clamp-1 cursor-pointer text-[15px] font-bold transition-colors hover:underline">
                  {filledData.name}
                </span>
                <span className="text-[13px] font-medium text-gray-500">
                  {filledData.specs}
                </span>
                {filledData.inStock !== false && (
                  <div className="mt-0.5 flex items-center gap-1">
                    <Check
                      className="h-3.5 w-3.5 text-green-600"
                      strokeWidth={3}
                    />
                    <span className="text-[12px] font-bold text-green-600">
                      Còn hàng
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Price & Actions */}
            <div className="ml-auto flex shrink-0 flex-col items-end gap-2 md:flex-row md:items-center md:gap-6">
              <span className="text-destructive text-[16px] font-bold">
                {formattedPrice}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={onEdit}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-gray-100 text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
                  aria-label="Edit"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={onRemove}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-red-50 text-red-500 transition-colors hover:bg-red-100 hover:text-red-700"
                  aria-label="Remove"
                >
                  <X className="h-4 w-4" strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
