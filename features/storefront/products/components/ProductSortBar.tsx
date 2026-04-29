"use client";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductSortBarProps {
  onSortChange?: (sort: string) => void;
}

const SORT_MAP: Record<string, string> = {
  "Liên quan": "",
  "Mới nhất": "-createdAt",
  "Bán chạy": "-totalStock",
  "Giá: Thấp đến Cao": "price",
  "Giá: Cao đến Thấp": "-price",
};

const ProductSortBar = ({ onSortChange }: ProductSortBarProps) => {
  const [activeSort, setActiveSort] = useState("Liên quan");
  const sortOptions = ["Liên quan", "Mới nhất", "Bán chạy"];

  const handleSort = (option: string) => {
    setActiveSort(option);
    onSortChange?.(SORT_MAP[option] ?? "");
  };

  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between lg:mb-6 lg:pb-6">
      <div className="flex flex-wrap items-center gap-4 text-base md:gap-6 md:text-lg">
        <span className="text-gray-500">Sắp xếp theo:</span>
        {sortOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleSort(option)}
            className={cn(
              "cursor-pointer transition-colors",
              activeSort === option
                ? "text-primary font-bold underline underline-offset-4"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            {option}
          </button>
        ))}

        <select
          className="focus:border-primary ml-2 h-9 cursor-pointer rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none hover:border-gray-300"
          onChange={(e) => handleSort(e.target.value)}
        >
          <option>Giá: Thấp đến Cao</option>
          <option>Giá: Cao đến Thấp</option>
        </select>
      </div>
    </div>
  );
};

export default ProductSortBar;
