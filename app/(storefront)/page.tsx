import { ProductList } from "@/components/shared";
import { getProducts } from "@/features/products/api/productsApi";
import {
  AiPcBuilderBanner,
  CategoryFilter,
  HeroSection,
} from "@/features/home/components";

const page = async () => {
  const productsList = await getProducts();
  
  // Tạm chia danh sách lấy được từ API:
  // - Lấy 4 sản phẩm đầu tiên cho Sản phẩm nổi bật
  const featuredProducts = productsList.slice(0, 4);

  // - Lấy các sản phẩm thuộc linh kiện PC
  const pcComponentsSlugs = ["cpu", "vga", "mainboard", "ram", "ssd-hdd", "psu-case"];
  const pcComponents = productsList
    .filter((p) => pcComponentsSlugs.includes(p.categorySlug))
    .slice(0, 4);

  // Nếu API chưa đủ linh kiện PC, fallback dùng tạm 4 cái cuối trong list
  const finalBuildPcProducts = pcComponents.length > 0 ? pcComponents : productsList.slice(-4).reverse();

  return (
    <main className="px-4 py-4 md:px-8 md:py-6 lg:px-12 xl:px-16 lg:py-7.5">
      <HeroSection />
      <CategoryFilter />
      <ProductList title="Sản phẩm nổi bật" products={featuredProducts} />
      <ProductList title="Linh kiện build PC" products={finalBuildPcProducts} />
      <AiPcBuilderBanner />
    </main>
  );
};

export default page;
