import { DetailedProduct } from "@/features/storefront/products/utils/mockProductDetail";

export const ProductHighlights = ({ highlights }: { highlights: DetailedProduct["highlights"] }) => {
  return (
    <div className="rounded-xl border border-gray-100 bg-gray-50 p-6 md:p-8 h-full">
      <h2 className="text-xl font-bold text-gray-900">Đặc điểm nổi bật</h2>
      
      <ul className="mt-6 flex flex-col gap-4 text-sm text-gray-700 leading-relaxed">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-2">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gray-600" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductHighlights;
