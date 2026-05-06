import { ProductList } from "@/components/shared";
import { getProducts } from "@/features/storefront/products/api/productsApi";
import {
  AiPcBuilderBanner,
  CategoryFilter,
  HeroSection,
} from "@/features/storefront/home/components";
import type { ProductType } from "@/components/shared/ProductCard";

const page = async () => {
  let productsList: ProductType[] = [];
  try {
    productsList = (await getProducts()) as unknown as ProductType[];
  } catch {
    productsList = [];
  }

  const featuredProducts = productsList.slice(0, 4);
  const pcComponentsSlugs = ["cpu", "vga", "mainboard", "ram", "ssd", "psu", "case"];
  const pcComponents = productsList
    .filter((p: any) => pcComponentsSlugs.includes(p.categorySlug))
    .slice(0, 4);
  const finalBuildPcProducts =
    pcComponents.length > 0 ? pcComponents : productsList.slice(4, 8);

  return (
    <main className="px-4 py-4 md:px-8 md:py-6 lg:px-12 xl:px-16 lg:py-7.5">
      <HeroSection />
      <CategoryFilter />
      <ProductList title="Sản phẩm nổi bật" products={featuredProducts} ctaLabel="MUA NGAY" />
      <ProductList
        title="Linh kiện build PC"
        products={finalBuildPcProducts}
        ctaLabel="THÊM VÀO GIỎ"
      />
      <AiPcBuilderBanner />
    </main>
  );
};

export default page;
