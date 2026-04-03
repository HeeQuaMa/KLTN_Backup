import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface ProductPaginationProps {
  currentPage?: number;
  totalPages?: number;
}

const ProductPagination = ({
  currentPage = 1,
  totalPages = 5,
}: ProductPaginationProps) => {
  return (
    <div className="mt-10 mb-6 flex items-center justify-center gap-1.5">
      <Button
        variant="outline"
        size="icon"
        disabled={currentPage === 1}
        className="rounded-[8px] border-gray-200 text-gray-500 shadow-none hover:text-gray-900"
      >
        <ChevronLeft className="h-4.5 w-4.5" strokeWidth={1.5} />
      </Button>

      <Button
        variant="default"
        size="icon"
        className="rounded-[8px] text-[15px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
      >
        1
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="hover:text-primary rounded-[8px] border-gray-200 text-[15px] text-gray-700 shadow-none hover:bg-gray-50"
      >
        2
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="hover:text-primary rounded-[8px] border-gray-200 text-[15px] text-gray-700 shadow-none hover:bg-gray-50"
      >
        3
      </Button>

      <div className="flex h-9 w-9 items-end justify-center pb-1.5 text-sm tracking-widest text-gray-400">
        ...
      </div>

      <Button
        variant="outline"
        size="icon"
        className="hover:text-primary rounded-[8px] border-gray-200 text-[15px] text-gray-700 shadow-none hover:bg-gray-50"
      >
        5
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="rounded-[8px] border-gray-200 text-gray-500 shadow-none hover:text-gray-900"
      >
        <ChevronRight className="h-5.4 w-5.4" strokeWidth={1.5} />
      </Button>
    </div>
  );
};

export default ProductPagination;
