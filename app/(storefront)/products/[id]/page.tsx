import { notFound } from "next/navigation";
import { getProducts, getProductById } from "@/features/storefront/products/api/productsApi";
import { ProductList } from "@/components/shared";
import {
  ProductGallery,
  ProductInfo,
  ProductSpecs,
  ProductHighlights,
} from "@/features/storefront/products/components";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;

  // Lấy data chi tiết sản phẩm từ API
  const product = await getProductById(id);
  const productsList = await getProducts();

  if (!product) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-[1440px] px-4 py-6 md:px-8 lg:px-12 xl:px-16 lg:py-10 flex-1">
      {/* Breadcrumb (Placeholder) */}
      

      {/* Khối Trên (Top Section) */}
      <div className="mt-6 flex flex-col gap-8 lg:flex-row lg:gap-12 xl:gap-16">
        <div className="w-full lg:w-[45%] xl:w-1/2">
          <ProductGallery product={product} />
        </div>
        <div className="w-full flex-1">
          <ProductInfo product={product} />
        </div>
      </div>

      {/* Khối Dưới (Bottom Section) */}
      <div className="mt-12 md:mt-16 flex flex-col gap-8 lg:flex-row lg:gap-12 xl:gap-16">
        <div className="w-full lg:w-[60%] xl:w-2/3">
          <ProductSpecs specs={product.specs} />
        </div>
        <div className="w-full lg:w-[40%] xl:w-1/3">
          <ProductHighlights highlights={product.highlights} />
        </div>
      </div>

      <div className="mt-16 w-full">
        <ProductList title="SẢN PHẨM TƯƠNG TỰ" products={productsList.slice(0, 5)} />
      </div>
    </main>
  );
};

export default ProductPage;
