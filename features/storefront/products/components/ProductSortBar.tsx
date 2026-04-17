"use client";

import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { cn } from "@/lib/utils";

const ProductSortBar = () => {
  const [activeSort, setActiveSort] = useState("Liên quan");
  const sortOptions = ["Liên quan", "Mới nhất", "Bán chạy"];

  return (
    <div className="mb-6 flex flex-wrap items-center gap-6 border-b border-gray-100 pb-4 text-[15px]">
      <span className="text-gray-600">Sắp xếp theo:</span>
      {sortOptions.map((option) => (
        <Button
          key={option}
          onClick={() => setActiveSort(option)}
          className={cn(
            "cursor-pointer transition-colors",
            activeSort === option
              ? "text-primary border-primary border-b-2 pb-0.5 font-bold"
              : "text-gray-600 hover:text-gray-900",
          )}
        >
          {option}
        </Button>
      ))}

      <select className="focus:border-primary focus:ring-primary/20 ml-4 h-9.5 cursor-pointer rounded border border-gray-200 bg-white px-3 text-[14px] text-gray-700 outline-none hover:border-gray-300 focus:ring-1">
        <option>Giá: Thấp đến Cao</option>
        <option>Giá: Cao đến Thấp</option>
      </select>
    </div>
  );
};

export default ProductSortBar;
