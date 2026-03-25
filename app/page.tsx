import ProductList from "@/components/shared/ProductList";
import {
  AiPcBuilderBanner,
  CategoryFilter,
  HeroSection,
} from "@/features/home/components";
import { product, productBuildPC } from "@/features/home/utils/product";

const page = () => {
  return (
    <main className="px-4 py-4 md:px-8 md:py-6 lg:px-12 xl:px-16 lg:py-7.5">
      <HeroSection />
      <CategoryFilter />
      <ProductList title="Sản phẩm nổi bật" products={product} />
      <ProductList title="Linh kiện build PC" products={productBuildPC} />
      <AiPcBuilderBanner />
    </main>
  );
};

export default page;
