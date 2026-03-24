import { Header, Footer, Navigation } from "@/components/layout";
import ProductList from "@/components/shared/ProductList";
import {
  AiPcBuilderBanner,
  CategoryFilter,
  HeroSection,
} from "@/features/home/components";
import { product, productBuildPC } from "@/features/home/utils/product";

const page = () => {
  return (
    <div>
      <Header />
      <Navigation />
      <main className="px-12 py-7.5">
        <HeroSection />
        <CategoryFilter />
        <ProductList title="Sản phẩm nổi bật" products={product} />
        <ProductList title="Linh kiện build PC" products={productBuildPC} />
        <AiPcBuilderBanner />
      </main>
      <Footer />
    </div>
  );
};

export default page;
