import { Button } from "@/components/ui/button";
import { DetailedProduct } from "@/features/storefront/products/utils/mockProductDetail";

export const ProductSpecs = ({ specs }: { specs: DetailedProduct["specs"] }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900">Thông số kỹ thuật</h2>
      
      <div className="mt-6 flex flex-col">
        {Object.keys(specs || {}).length === 0 ? (
          <div className="py-4 text-sm text-gray-500">Chưa có thông số kỹ thuật.</div>
        ) : (
          Object.entries(specs).map(([key, value], idx) => (
            <div key={idx} className="grid grid-cols-1 border-b border-gray-200 py-4 sm:grid-cols-3">
              <div className="text-sm text-gray-500 sm:col-span-1 capitalize">{key.replace(/_/g, ' ')}</div>
              <div className="mt-1 text-sm font-semibold text-gray-900 sm:col-span-2 sm:mt-0">{String(value)}</div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 flex justify-center">
        <Button className="rounded-full border border-primary px-8 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/5 focus:outline-none">
          XEM CẤU HÌNH CHI TIẾT
        </Button>
      </div>
    </div>
  );
};

export default ProductSpecs;
