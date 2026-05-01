import { HeroSection, CategoryFilter, AiPcBuilderBanner } from "@/features/storefront/home/components";
import { product } from "@/features/storefront/home/utils/product";
import ProductCard from "@/components/shared/ProductCard";

export default function HomePage() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-8 lg:px-12 xl:px-16 lg:py-10 flex-1">
      <HeroSection />
      <CategoryFilter />

      <section className="mt-8 lg:mt-10">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:gap-6">
          {product.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <AiPcBuilderBanner />
    </main>
  );
}
