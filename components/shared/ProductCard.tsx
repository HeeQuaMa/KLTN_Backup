"use client";

import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export interface ProductType {
  id?: number | string;
  name?: string;
  specs?: string;
  price?: number;
  originalPrice?: number | null;
  discount?: string | null;
  image?: string | null;
  brand?: string;
  categoryName?: string | null;
  totalStock?: number;
}

interface ProductCardProps {
  product: ProductType;
}

const vndFormatter = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

const formatPrice = (price: number | undefined | null): string => {
  if (price === undefined || price === null || isNaN(price)) return "—";
  return vndFormatter.format(price);
};

const ProductCard = ({ product }: ProductCardProps) => {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  // Fallback an toàn nếu id bị thiếu
  const productId = product?.id ?? "";

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!productId) return;

    addItem({
      id: productId,
      cartItemId: `${productId}-default`,
      name: product?.name ?? "Sản phẩm",
      price: product?.price ?? 0,
      image: product?.image ?? "",
      quantity: 1,
      configName: "Mặc định",
    });
    router.push("/cart");
  };

  // Sản phẩm không hợp lệ → không render gì cả
  if (!product?.name && !product?.id) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <Link href={productId ? `/products/${productId}` : "#"} className="flex flex-col flex-1">

        {/* Ảnh sản phẩm */}
        <div className="relative mb-4 flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-4">
          {product?.image ? (
            // <img> thay vì next/image: URL ảnh từ seed/CDN rất đa dạng, tránh phải khai báo từng hostname trong next.config
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image}
              alt={product?.name ?? "Product image"}
              className="max-h-full max-w-full object-contain mix-blend-multiply"
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-gray-100">
              <span className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                No image
              </span>
            </div>
          )}

          {/* Badge giảm giá */}
          {product?.discount && (
            <div className="bg-destructive absolute top-2 right-2 z-10 rounded-md px-2 py-0.5 text-xs font-bold text-white">
              {product.discount}
            </div>
          )}

          {/* Badge hết hàng */}
          {product?.totalStock === 0 && (
            <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
              <span className="rounded bg-black/70 px-2 py-1 text-xs font-bold text-white">
                Hết hàng
              </span>
            </div>
          )}
        </div>

        {/* Thông tin sản phẩm */}
        <div className="flex flex-1 flex-col">
          {/* Danh mục / thương hiệu */}
          {(product?.categoryName ?? product?.brand) && (
            <span className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
              {product?.categoryName ?? product?.brand}
            </span>
          )}

          <h3 className="line-clamp-2 text-[15px] font-bold text-gray-900 transition-colors group-hover:text-primary">
            {product?.name ?? "—"}
          </h3>

          <p className="mt-1 line-clamp-1 text-sm text-gray-500">
            {product?.specs ?? ""}
          </p>

          <div className="mt-4 mb-4 flex flex-1 flex-col justify-end">
            <div className="text-destructive text-[20px] font-bold">
              {formatPrice(product?.price)}
            </div>
            {product?.originalPrice ? (
              <p className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </p>
            ) : (
              <div className="h-5" />
            )}
          </div>
        </div>
      </Link>

      {/* Nút MUA NGAY — nằm ngoài Link để tránh nested interactive elements */}
      <Button
        onClick={handleBuyNow}
        disabled={product?.totalStock === 0}
        className="bg-primary hover:bg-primary/90 mt-auto w-full cursor-pointer rounded-md font-bold text-white disabled:opacity-50"
      >
        MUA NGAY
      </Button>
    </div>
  );
};

export default ProductCard;
