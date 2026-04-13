"use client";
import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DetailedProduct, ProductConfig } from "@/features/products/utils/mockProductDetail";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { cartApi } from "@/features/cart/api/cartApi";

export const ProductInfo = ({ product }: { product: DetailedProduct }) => {
  const [activeConfig, setActiveConfig] = useState<ProductConfig>(product.configurations[0]);
  const [isAdding, setIsAdding] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const { isLoggedIn, user } = useAuthStore();
  const router = useRouter();

  const handleAddToCart = async () => {
    if (!isLoggedIn || !user) {
      toast.warning("Vui lòng đăng nhập để thêm sản phẩm vào giỏ!");
      router.push("/login");
      return;
    }

    try {
      setIsAdding(true);
      const cartItemId = `${product.id}-${activeConfig.id}`;
      const price = product.basePrice + activeConfig.priceDelta;

      // Update backend via API
      await cartApi.addToCart({
        userId: user.id,
        productId: String(product.id),
        cartItemId,
        name: product.name,
        price,
        image: product.images?.[0] || "",
        quantity: 1,
        configName: activeConfig.name,
        sku: product.sku,
      });

      // Update local state if backend succeeds
      addItem({
        id: product.id,
        cartItemId,
        name: product.name,
        price,
        image: product.images?.[0] || "",
        quantity: 1,
        configName: activeConfig.name,
        sku: product.sku,
      });
      
      toast.success(`Đã thêm ${product.name} vào giỏ hàng!`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi thêm giỏ hàng!");
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    if (isLoggedIn && user) {
      router.push("/cart");
    }
  };

  const vndFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const formatPrice = (price: number) => vndFormatter.format(price);

  const currentPrice = product.basePrice + activeConfig.priceDelta;
  const currentOriginalPrice = product.originalPrice ? product.originalPrice + activeConfig.priceDelta : null;

  return (
    <div className="flex w-full flex-col">
      <h1 className="text-2xl font-bold leading-tight text-gray-900 md:text-3xl lg:text-4xl">
        {product.name}
      </h1>
      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
        <span>SKU: {product.sku}</span>
        <span className="h-4 w-px bg-gray-300"></span>
        <span>
          Tình trạng: <span className="font-semibold text-green-600">Còn hàng</span>
        </span>
      </div>

      {/* Box Giá */}
      <div className="mt-6 flex flex-wrap items-center gap-4 rounded-xl bg-blue-50/50 p-5 border border-blue-100/50">
        <span className="text-3xl font-bold text-destructive">
          {formatPrice(currentPrice)}
        </span>
        {currentOriginalPrice && (
          <span className="text-lg text-gray-400 line-through">
            {formatPrice(currentOriginalPrice)}
          </span>
        )}
        {product.discount && (
          <span className="rounded-md bg-destructive px-2 py-1 text-xs font-bold text-white">
            {product.discount}
          </span>
        )}
      </div>

      {/* Cấu hình sản phẩm */}
      <div className="mt-8">
        <h3 className="text-base font-bold text-gray-900">Cấu hình đang chọn:</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {product.configurations.map((config) => (
            <button
              key={config.id}
              onClick={() => setActiveConfig(config)}
              className={cn(
                "flex flex-col items-start cursor-pointer rounded-lg border p-3 text-sm transition-all focus:outline-none",
                activeConfig.id === config.id
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className={cn("font-bold", activeConfig.id === config.id ? "text-primary" : "text-gray-900")}>
                  {config.name}
                </span>
                {/* Custom Radio Icon */}
                <div className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full border",
                  activeConfig.id === config.id ? "border-primary" : "border-gray-300"
                )}>
                  {activeConfig.id === config.id && <div className="h-2 w-2 rounded-full bg-primary" />}
                </div>
              </div>
              {config.priceDelta > 0 && (
                <span className="mt-1 text-xs text-gray-500">
                  + {formatPrice(config.priceDelta)}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Ưu đãi Member */}
      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-5">
        <h3 className="font-bold text-gray-900">Ưu đãi Member NetTech:</h3>
        <ul className="mt-3 flex flex-col gap-2 text-sm text-gray-600">
          {product.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button 
          onClick={handleBuyNow}
          disabled={isAdding}
          className="flex-1 cursor-pointer bg-destructive hover:bg-destructive/90 h-14 text-lg font-bold text-white shadow-md flex-col items-center justify-center">
          <span>{isAdding ? "ĐANG XỬ LÝ..." : "MUA NGAY"}</span>
          <span className="text-xs font-normal opacity-90">Giao hàng tận nơi hoặc nhận tại shop</span>
        </Button>
        <Button 
          onClick={handleAddToCart}
          disabled={isAdding}
          className="flex-1 cursor-pointer bg-primary hover:bg-primary-hover/90 h-14 text-lg font-bold text-white shadow-md flex items-center justify-center gap-2">
          {isAdding ? (
            <span>ĐANG XỬ LÝ...</span>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5" />
              <span>THÊM VÀO GIỎ</span>
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductInfo;
