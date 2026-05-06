"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { useCart } from "@/features/storefront/cart/context/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Stepper } from "@/components/ui/stepper";
import { promotionApi } from "@/features/storefront/promotions/api/promotion.api";

export default function CartPage() {
  const router = useRouter();
  const {
    items,
    updateQuantity: updateQuantityApi,
    removeFromCart,
    totalQuantity,
    totalPrice,
  } = useCart();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [mounted, setMounted] = useState(false);

  // --- KẾT NỐI VỚI VÍ CHUNG (ZUSTAND STORE) ---
  const { appliedVoucher, discountAmount, setVoucher, resetVoucher } =
    useCartStore();

  // inputCode dùng để quản lý riêng cái chữ người dùng đang gõ trong ô nhập
  const [inputCode, setInputCode] = useState(appliedVoucher || "");
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Nếu trong ví đã có mã cũ, hiện lên ô nhập luôn cho người dùng thấy
    if (appliedVoucher) setInputCode(appliedVoucher);
  }, [appliedVoucher]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // --- HÀM XỬ LÝ ÁP DỤNG VOUCHER ---
  const handleApplyVoucher = async () => {
    if (!inputCode.trim()) {
      toast.warning("Vui lòng nhập mã khuyến mãi!");
      return;
    }

    setIsApplying(true);
    try {
      const res = await promotionApi.applyVoucher({
        code: inputCode,
        orderValue: totalPrice,
      });

      // LƯU THẲNG VÀO STORE (Dữ liệu sẽ được giữ lại khi chuyển trang)
      setVoucher(inputCode, res.discountAmount);
      toast.success(res.message || "Áp dụng mã giảm giá thành công!");
    } catch (error: any) {
      console.error("Lỗi áp dụng mã:", error);
      const msg = error?.response?.data?.message || "Mã giảm giá không hợp lệ!";
      toast.error(msg);

      // Nếu mã sai, xóa mã cũ trong ví luôn cho chắc
      resetVoucher();
    } finally {
      setIsApplying(false);
    }
  };

  // Tổng tiền cuối cùng lấy giá trị discountAmount từ Store
  const finalTotal = totalPrice - discountAmount;

  if (!mounted) return <div className="min-h-screen" />;

  return (
    <main className="mx-auto w-full max-w-360 flex-1 bg-gray-50/30 px-4 py-8 md:px-8 lg:px-12 lg:py-10 xl:px-16">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="flex items-baseline gap-2 text-2xl font-extrabold tracking-tight text-gray-900 uppercase md:text-[28px]">
          Giỏ hàng của bạn
          <span className="text-sm font-normal text-gray-500 normal-case">
            ({totalQuantity} sản phẩm)
          </span>
        </h1>
        <Stepper currentStep={1} />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Cột Trái: Sản phẩm */}
        <div className="w-full lg:w-[65%] xl:w-[70%]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <ShieldCheck className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <h3 className="text-lg font-bold text-gray-900">Giỏ hàng rỗng</h3>
              <Link href="/">
                <Button className="mt-6">Tiếp tục khám phá</Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <div className="hidden grid-cols-12 gap-4 rounded-xl bg-gray-100/80 px-4 py-3 text-xs font-bold text-gray-500 uppercase md:grid">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>

              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="group relative grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-12"
                >
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="hover:text-destructive absolute right-4 top-4 text-gray-300 transition-colors group-hover:opacity-100 md:top-1/2 md:-translate-y-1/2 md:opacity-0"
                    title="Xóa sản phẩm"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  <div className="col-span-1 flex gap-4 pr-6 md:col-span-6 md:pr-0">
                    <Link
                      href={`/products/${item.id}`}
                      className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-2 transition-transform hover:scale-105 md:h-24 md:w-24"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-h-full max-w-full object-contain p-2 mix-blend-multiply"
                      />
                    </Link>
                    <div className="flex flex-col justify-center">
                      <Link
                        href={`/products/${item.id}`}
                        className="line-clamp-2 text-sm font-bold text-gray-900 transition-colors hover:text-primary md:text-base"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-1 text-xs text-gray-500">
                        Cấu hình: {item.configName || "Mặc định"}
                      </p>
                      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
                        <CheckCircle2 className="h-3 w-3" /> Còn hàng
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 hidden flex-col items-center justify-center md:flex">
                    <span className="font-bold text-gray-900">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  <div className="col-span-1 flex items-center justify-between md:col-span-2 md:justify-center">
                    <span className="text-sm font-semibold text-gray-500 md:hidden">
                      Số lượng:
                    </span>
                    <div className="flex items-center rounded-md border border-gray-200 bg-white md:bg-gray-50/50">
                      <button
                        onClick={() =>
                          updateQuantityApi(item.cartItemId, item.quantity - 1)
                        }
                        className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex h-8 w-8 items-center justify-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantityApi(item.cartItemId, item.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="col-span-1 flex items-center justify-between md:col-span-2 md:justify-end md:pr-8">
                    <span className="text-sm font-semibold text-gray-500 md:hidden">
                      Thành tiền:
                    </span>
                    <span className="text-destructive font-bold md:text-lg">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
              <Link
                href="/"
                className="text-primary mt-4 text-sm font-semibold hover:underline"
              >
                <ArrowLeft className="mr-1 inline h-4 w-4" /> Tiếp tục mua sắm
              </Link>
            </div>
          )}
        </div>

        {/* Cột Phải: Tổng quan đơn hàng */}
        {items.length > 0 && (
          <div className="w-full lg:w-[35%] xl:w-[30%]">
            <div className="sticky top-6 overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-lg font-bold uppercase">
                Tổng quan đơn hàng
              </h2>

              <div className="mb-4 flex justify-between text-sm">
                <span>Tạm tính:</span>
                <span className="font-bold">{formatPrice(totalPrice)}</span>
              </div>

              {/* HIỂN THỊ GIẢM GIÁ TỪ STORE */}
              <div className="mb-6 flex justify-between text-sm">
                <span>Giảm giá:</span>
                <span className="font-bold text-green-600">
                  - {formatPrice(discountAmount)}
                </span>
              </div>

              {/* Ô NHẬP VOUCHER */}
              <div className="mb-6 flex gap-2 border-b border-dashed pb-6">
                <Input
                  placeholder="Nhập mã khuyến mãi"
                  className="h-10 text-sm uppercase"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  disabled={isApplying}
                />
                <Button
                  onClick={handleApplyVoucher}
                  disabled={isApplying}
                  className="bg-primary h-10 font-bold text-white"
                >
                  {isApplying ? "..." : "ÁP DỤNG"}
                </Button>
              </div>

              <div className="mb-6 flex items-end justify-between">
                <span className="text-base font-bold">Tổng cộng:</span>
                <div className="text-right">
                  <span className="text-destructive text-2xl font-black">
                    {formatPrice(finalTotal)}
                  </span>
                  <p className="mt-1 text-[10px] text-gray-400">
                    (Đã bao gồm VAT)
                  </p>
                </div>
              </div>

              <Button
                onClick={() => {
                  if (!isLoggedIn) {
                    toast.warning("Vui lòng đăng nhập để thanh toán!");
                    router.push("/login");
                    return;
                  }
                  router.push("/checkout");
                }}
                className="bg-destructive h-14 w-full font-bold text-white uppercase shadow-lg"
              >
                TIẾN HÀNH THANH TOÁN
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
