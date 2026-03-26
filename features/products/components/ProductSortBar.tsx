import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductSortBar = () => {
  return (
    <div className="flex flex-col gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-center md:justify-between lg:mb-6 lg:pb-6">
      <div className="flex flex-wrap items-center gap-4 text-xl md:gap-6">
        <span className="text-gray-500">Sắp xếp theo:</span>
        <button className="font-bold text-primary underline underline-offset-4">
          Liên quan
        </button>
        <button className="text-gray-600 hover:text-gray-900">Mới nhất</button>
        <button className="text-gray-600 hover:text-gray-900">Bán chạy</button>

        <select className="ml-2 h-9 rounded-md border border-gray-200 bg-white px-3 text-sm text-gray-700 outline-none hover:border-gray-300 focus:border-primary">
          <option>Giá: Thấp đến Cao</option>
          <option>Giá: Cao đến Thấp</option>
        </select>
      </div>

      <div className="flex items-center gap-3 text-sm text-gray-600">
        <span>Trang 1/5</span>
        <div className="flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600 disabled:opacity-50">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:border-primary hover:text-primary">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductSortBar;
