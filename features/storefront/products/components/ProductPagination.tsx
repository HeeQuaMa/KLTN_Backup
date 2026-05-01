"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductPaginationProps {
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
}

const ProductPagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}: ProductPaginationProps) => {
  // Nếu chỉ có 1 trang thì không hiện pagination
  if (totalPages <= 1) return null;

  // Logic tính toán hiển thị số trang và dấu "..." từ nhánh Incoming
  const getPageNumbers = (): (number | "...")[] => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="mt-10 mb-6 flex items-center justify-center gap-2">
      {/* Nút Back - Dùng Button của HEAD */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        onClick={() => onPageChange?.(currentPage - 1)}
        className="h-9 w-9 rounded-md border-gray-200 text-gray-500 shadow-none hover:text-gray-900 disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
      </Button>

      {/* Danh sách các số trang */}
      {getPageNumbers().map((page, idx) =>
        page === "..." ? (
          <div
            key={`ellipsis-${idx}`}
            className="flex h-9 w-9 items-end justify-center pb-1.5 text-sm tracking-widest text-gray-400"
          >
            ...
          </div>
        ) : (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange?.(page)}
            className={cn(
              "h-9 w-9 rounded-md text-[15px] font-medium transition-all shadow-none",
              currentPage === page
                ? "text-white"
                : "border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-primary"
            )}
          >
            {page}
          </Button>
        )
      )}

      {/* Nút Next - Dùng Button của HEAD */}
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange?.(currentPage + 1)}
        className="h-9 w-9 rounded-md border-gray-200 text-gray-500 shadow-none hover:text-gray-900 disabled:opacity-50"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
      </Button>
    </div>
  );
};

export default ProductPagination;