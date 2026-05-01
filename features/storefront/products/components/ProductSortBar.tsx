"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button"; // Giữ component từ HEAD

interface ProductSortBarProps {
  onSortChange?: (sort: string) => void;
}

// Map các lựa chọn hiển thị sang query string của API (Lấy từ Incoming)
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
    // Gửi giá trị đã map (vd: -price) về component cha để gọi API
    onSortChange?.(SORT_MAP[option] ?? "");
  };

  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between lg:mb-6 lg:pb-6">
      <div className="flex flex-wrap items-center gap-4 text-[15px] md:gap-6">
        <span className="text-gray-500">Sắp xếp theo:</span>
        
        {sortOptions.map((option) => (
          <Button
            key={option}
            variant="ghost" // Hoặc style phù hợp với UI của bạn
            onClick={() => handleSort(option)}
            className={cn(
              "h-auto p-0 cursor-pointer transition-colors hover:bg-transparent",
              activeSort === option
                ? "text-primary border-primary border-b-2 pb-0.5 font-bold rounded-none"
                : "text-gray-600 hover:text-gray-900",
            )}
          >
            {option}
          </Button>
        ))}

        <select
          className="focus:border-primary ml-2 h-9 cursor-pointer rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none hover:border-gray-300"
          onChange={(e) => handleSort(e.target.value)}
          value={activeSort}
        >
          {/* Chỉ hiện các tùy chọn giá trong select để tránh lặp lại các nút bấm phía trên */}
          <option value="Liên quan" hidden>Chọn lọc giá</option>
          <option value="Giá: Thấp đến Cao">Giá: Thấp đến Cao</option>
          <option value="Giá: Cao đến Thấp">Giá: Cao đến Thấp</option>
        </select>
      </div>
    </div>
  );
};

export default ProductSortBar;