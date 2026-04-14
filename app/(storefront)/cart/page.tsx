"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
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
import { cn } from "@/lib/utils";
import { Stepper } from "@/components/ui/stepper";

export default function CartPage() {
  const router = useRouter();
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } =
    useCartStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  if (!mounted) return <div className="min-h-screen" />;

  return (
    <main className="mx-auto w-full max-w-360 flex-1 bg-gray-50/30 px-4 py-8 md:px-8 lg:px-12 lg:py-10 xl:px-16">
      {/* Header Giỏ hàng */}
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="flex items-baseline gap-2 text-2xl font-extrabold tracking-tight text-gray-900 uppercase md:text-[28px]">
          Giỏ hàng của bạn
          <span className="text-sm font-normal text-gray-500 normal-case">
            ({getTotalItems()} sản phẩm)
          </span>
        </h1>

        {/* Stepper (Chỉ hiện trên Desktop/Tablet) */}
        <Stepper currentStep={1} />
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        {/* Cột Trái: Danh sách Sản phẩm */}
        <div className="w-full lg:w-[65%] xl:w-[70%]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <div className="mb-4 text-gray-300">
                <ShieldCheck className="mx-auto h-16 w-16" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Giỏ hàng rỗng</h3>
              <p className="mt-2 text-gray-500">
                Có vẻ như bạn chưa chọn sản phẩm nào.
              </p>
              <Link href="/">
                <Button className="bg-primary hover:bg-primary-hover/90 mt-6 text-white">
                  <ArrowLeft className="mr-2 h-4 w-4 text-white" /> Tiếp tục
                  khám phá
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Table Header (ẩn ở mobile) */}
              <div className="hidden grid-cols-12 gap-4 rounded-xl bg-gray-100/80 px-4 py-3 text-xs font-bold text-gray-500 uppercase md:grid">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>

              {/* Danh sách Items */}
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="group relative grid grid-cols-1 gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-12"
                >
                  {/* Nút Xoá (Mobile & Desktop) */}
                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="hover:text-destructive absolute top-4 right-4 text-gray-300 transition-colors group-hover:opacity-100 md:top-1/2 md:-translate-y-1/2 md:opacity-0"
                    title="Xoá sản phẩm"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  {/* SP Info (Clickable) */}
                  <div className="col-span-1 flex gap-4 pr-6 md:col-span-6 md:pr-0">
                    <Link
                      href={`/products/${item.id}`}
                      className="relative flex h-20 w-20 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-gray-100 bg-gray-50 p-2 transition-transform hover:scale-105 md:h-24 md:w-24"
                    >
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-contain p-2 mix-blend-multiply"
                      />
                    </Link>
                    <div className="flex flex-col justify-center">
                      <Link
                        href={`/products/${item.id}`}
                        className="hover:text-primary line-clamp-2 cursor-pointer text-sm font-bold text-gray-900 transition-colors md:text-base"
                      >
                        {item.name}
                      </Link>
                      {item.configName && (
                        <p className="mt-1 text-xs text-gray-500">
                          Cấu hình: {item.configName}
                        </p>
                      )}
                      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
                        <CheckCircle2 className="h-3 w-3" /> Còn hàng
                      </div>
                    </div>
                  </div>

                  {/* Đơn giá (ẩn ở mobile, chuyển lên thành tiền) */}
                  <div className="col-span-2 hidden flex-col items-center justify-center md:flex">
                    <span className="font-bold text-gray-900">
                      {formatPrice(item.price)}
                    </span>
                  </div>

                  {/* Số lượng */}
                  <div className="col-span-1 flex items-center justify-between md:col-span-2 md:justify-center">
                    <span className="text-sm font-semibold text-gray-500 md:hidden">
                      Số lượng:
                    </span>
                    <div className="flex items-center rounded-md border border-gray-200 bg-white md:bg-gray-50/50">
                      <button
                        onClick={() =>
                          updateQuantity(item.cartItemId, item.quantity - 1)
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
                          updateQuantity(item.cartItemId, item.quantity + 1)
                        }
                        className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Thành tiền */}
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

              <div className="mt-4">
                <Link
                  href="/"
                  className="text-primary inline-flex items-center gap-2 text-sm font-semibold hover:underline"
                >
                  <ArrowLeft className="h-4 w-4" /> Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Cột Phải: Tổng quan đơn hàng */}
        {items.length > 0 && (
          <div className="w-full lg:w-[35%] xl:w-[30%]">
            <div className="sticky top-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900 uppercase">
                  Tổng quan đơn hàng
                </h2>
              </div>

              <div className="p-6">
                <div className="mb-4 flex justify-between text-sm text-gray-600">
                  <span>Tạm tính:</span>
                  <span className="font-bold text-gray-900">
                    {formatPrice(getTotalPrice())}
                  </span>
                </div>
                <div className="mb-6 flex justify-between text-sm text-gray-600">
                  <span>Giảm giá:</span>
                  <span className="font-bold text-green-600">- 0đ</span>
                </div>

                {/* Input Khuyến mãi */}
                <div className="mb-6 flex gap-2 border-b border-dashed border-gray-200 pb-6">
                  <Input
                    placeholder="Nhập mã khuyến mãi"
                    className="focus-visible:ring-primary/20 h-10 text-sm"
                  />
                  <Button
                    variant="secondary"
                    className="bg-primary hover:bg-primary-hover/90 h-10 cursor-pointer font-bold text-white"
                  >
                    ÁP DỤNG
                  </Button>
                </div>

                <div className="mb-6 flex items-end justify-between">
                  <span className="text-base font-bold text-gray-900">
                    Tổng cộng:
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-destructive text-2xl leading-none font-black">
                      {formatPrice(getTotalPrice())}
                    </span>
                    <span className="mt-1 text-[10px] text-gray-400">
                      (Đã bao gồm VAT)
                    </span>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    if (!isLoggedIn) {
                      toast.warning(
                        "Vui lòng đăng nhập để tiến hành thanh toán!",
                      );
                      router.push("/login");
                      return;
                    }
                    router.push("/checkout");
                  }}
                  className="bg-destructive hover:bg-destructive/90 shadow-destructive/20 h-14 w-full cursor-pointer text-lg font-bold tracking-wide text-white uppercase shadow-lg transition-all hover:-translate-y-0.5"
                >
                  TIẾN HÀNH THANH TOÁN
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-500">
                  <ShieldCheck className="h-4 w-4 text-green-600" />
                  Bảo mật thanh toán tuyệt đối
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
