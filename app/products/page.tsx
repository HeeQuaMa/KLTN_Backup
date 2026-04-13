import { ProductCard } from "@/components/shared";
import { getProducts } from "@/features/products/api/productsApi";
import {
  ProductSortBar,
  SidebarFilter,
  ProductPagination,
} from "@/features/products/components";

const Products = async () => {
  const products = await getProducts();

  return (
    <main className="min-h-screen bg-white px-4 py-6 md:px-8 lg:px-12 lg:py-10 xl:px-16">
      <div className="mx-auto flex w-full max-w-350 flex-col items-start gap-8 lg:flex-row lg:gap-12">
        <SidebarFilter />
        <div className="w-full flex-1">
          <ProductSortBar />
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 2xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <ProductPagination />
        </div>
      </div>
    </main>
  );
};

export default Products;
