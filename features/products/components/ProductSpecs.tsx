import { DetailedProduct } from "@/features/products/utils/mockProductDetail";

export const ProductSpecs = ({ specs }: { specs: DetailedProduct["specs"] }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-6 md:p-8">
      <h2 className="text-xl font-bold text-gray-900">Thông số kỹ thuật</h2>
      
      <div className="mt-6 flex flex-col">
        <div className="grid grid-cols-1 border-b border-gray-200 py-4 sm:grid-cols-3">
          <div className="text-sm text-gray-500 sm:col-span-1">CPU</div>
          <div className="mt-1 text-sm font-semibold text-gray-900 sm:col-span-2 sm:mt-0">{specs.cpu}</div>
        </div>
        
        <div className="grid grid-cols-1 border-b border-gray-200 py-4 sm:grid-cols-3">
          <div className="text-sm text-gray-500 sm:col-span-1">RAM</div>
          <div className="mt-1 text-sm font-semibold text-gray-900 sm:col-span-2 sm:mt-0">{specs.ram}</div>
        </div>

        <div className="grid grid-cols-1 border-b border-gray-200 py-4 sm:grid-cols-3">
          <div className="text-sm text-gray-500 sm:col-span-1">Ổ cứng</div>
          <div className="mt-1 text-sm font-semibold text-gray-900 sm:col-span-2 sm:mt-0">{specs.storage}</div>
        </div>

        <div className="grid grid-cols-1 border-b border-gray-200 py-4 sm:grid-cols-3">
          <div className="text-sm text-gray-500 sm:col-span-1">Card đồ họa (VGA)</div>
          <div className="mt-1 text-sm font-semibold text-gray-900 sm:col-span-2 sm:mt-0">{specs.vga}</div>
        </div>

        <div className="grid grid-cols-1 border-b border-gray-200 py-4 sm:grid-cols-3">
          <div className="text-sm text-gray-500 sm:col-span-1">Màn hình</div>
          <div className="mt-1 text-sm font-semibold text-gray-900 sm:col-span-2 sm:mt-0">{specs.display}</div>
        </div>

        <div className="grid grid-cols-1 border-b border-gray-200 py-4 sm:grid-cols-3">
          <div className="text-sm text-gray-500 sm:col-span-1">Pin</div>
          <div className="mt-1 text-sm font-semibold text-gray-900 sm:col-span-2 sm:mt-0">{specs.battery}</div>
        </div>

        <div className="grid grid-cols-1 py-4 sm:grid-cols-3">
          <div className="text-sm text-gray-500 sm:col-span-1">Trọng lượng</div>
          <div className="mt-1 text-sm font-semibold text-gray-900 sm:col-span-2 sm:mt-0">{specs.weight}</div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <button className="rounded-full border border-primary px-8 py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/5 focus:outline-none">
          XEM CẤU HÌNH CHI TIẾT
        </button>
      </div>
    </div>
  );
};

export default ProductSpecs;
