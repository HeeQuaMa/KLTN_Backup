"use client";

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";

export interface ProductType {
  id?: number | string;
  name: string;
  specs: string;
  price: number;
  originalPrice?: number | null;
  discount?: string | null;
  image?: string | any;
}

interface ProductCardProps {
  product: ProductType;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const vndFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const formatPriceVND = (price: number) => `${vndFormatter.format(price)}`;

  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  // Default to ID 1 if missing so it doesn't crash routing
  const productId = product.id || 1;

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      id: productId,
      cartItemId: `${productId}-default`,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
      configName: "Mặc định",
    });
    router.push("/cart");
  };

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md">
      <Link href={`/products/${productId}`} className="flex flex-col flex-1">
        <div className="relative mb-4 flex aspect-square w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-50 p-4">
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-4 mix-blend-multiply"
            />
          ) : (
            <div className="h-full w-full bg-gray-100" />
          )}

          {product.discount && (
            <div className="bg-destructive absolute top-2 right-2 z-10 rounded-md px-2 py-0.5 text-xs font-bold text-white">
              {product.discount}
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col">
          <h3 className="line-clamp-2 text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-500">{product.specs}</p>

          <div className="mt-4 mb-4 flex flex-1 flex-col justify-end">
            <div className="text-destructive text-[22px] font-bold">
              {formatPriceVND(product.price)}
            </div>
            <div className="h-5">
              {product.originalPrice ? (
                <p className="text-sm text-gray-400 line-through">
                  {formatPriceVND(product.originalPrice)}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </Link>
      
      {/* Nút nằm ngoài thẻ Link để tránh lỗi click lồng xếp (nested interactive elements) */}
      <Button 
        onClick={handleBuyNow}
        className="bg-primary hover:bg-primary-hover/90 mt-auto w-full cursor-pointer rounded-md font-bold text-white">
        MUA NGAY
      </Button>
    </div>
  );
};

export default ProductCard;
