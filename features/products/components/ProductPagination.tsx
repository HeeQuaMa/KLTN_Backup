import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductPaginationProps {
  currentPage?: number;
  totalPages?: number;
}

const ProductPagination = ({
  currentPage = 1,
  totalPages = 5,
}: ProductPaginationProps) => {
  return (
    <div className="mt-10 mb-6 flex items-center justify-center gap-2">
      <button
        disabled={currentPage === 1}
        className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      <button className="border-primary bg-primary flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border font-bold text-white shadow-sm">
        1
      </button>

      <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900">
        2
      </button>

      <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900">
        3
      </button>

      <div className="flex h-9 w-9 items-end justify-center pb-1 text-gray-400">
        ...
      </div>

      <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-600 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-900">
        5
      </button>

      <button className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900">
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default ProductPagination;
