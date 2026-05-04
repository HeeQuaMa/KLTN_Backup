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
              {/* ... (Phần map items bạn giữ nguyên code cũ nhé) ... */}
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-4 rounded-xl border bg-white p-4"
                >
                  {/* Giữ nguyên logic hiển thị sản phẩm của bạn ở đây */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 object-contain"
                  />
                  <div className="flex-1">
                    <h4 className="font-bold">{item.name}</h4>
                    <p className="text-destructive font-bold">
                      {formatPrice(item.price)}
                    </p>
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
