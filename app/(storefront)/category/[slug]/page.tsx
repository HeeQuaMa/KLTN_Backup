import { ProductCard } from "@/components/shared";
import { getProducts } from "@/features/storefront/products/api/productsApi";
import { getCategoryBySlug } from "@/features/storefront/categories/api/categoriesApi";
import {
  ProductSortBar,
  SidebarFilter,
  ProductPagination,
} from "@/features/storefront/products/components";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  // Gọi 2 API song song để tối ưu thời gian tải
  const [categoryData, categoryProducts] = await Promise.all([
    getCategoryBySlug(slug),
    getProducts({ category: slug })
  ]);

  const title = categoryData?.name || "Danh mục sản phẩm";

  return (
    <main className="min-h-screen bg-gray-50/50 px-4 py-6 md:px-8 lg:px-12 lg:py-10 xl:px-16">
      <div className="mx-auto flex w-full max-w-360 flex-col items-start gap-8 lg:flex-row lg:gap-12">
        <SidebarFilter categorySlug={slug} />
        <div className="w-full flex-1">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 md:text-[28px]">
              {title}
            </h2>
          </div>

          <ProductSortBar />

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 2xl:grid-cols-4">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <ProductPagination />
        </div>
      </div>
    </main>
  );
}
