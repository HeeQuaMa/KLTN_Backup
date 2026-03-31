"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { CHECKOUT_FEES } from "@/constants/checkout";
import {
  checkoutSchema,
  CheckoutFormData,
} from "@/features/checkout/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [mounted, setMounted] = useState(false);

  // Hook-form
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    // @ts-ignore
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      city: "",
      district: "",
      ward: "",
      addressDetail: "",
      saveAddress: false,
      paymentMethod: "COD",
    },
  });

  const selectedPayment = watch("paymentMethod");

  useEffect(() => {
    setMounted(true);
    // Nếu chưa đăng nhập, đá về trang login
    if (!useAuthStore.getState().isLoggedIn) {
      toast.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      router.replace("/login");
    } else if (useCartStore.getState().items.length === 0) {
      toast.warning("Giỏ hàng của bạn đang trống!");
      router.replace("/cart");
    }
  }, [router]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const VNPAY_DISCOUNT =
    selectedPayment === "VNPAY" ? CHECKOUT_FEES.VNPAY_DISCOUNT_AMOUNT : 0;
  const finalPrice =
    getTotalPrice() +
    CHECKOUT_FEES.SHIPPING_FEE -
    CHECKOUT_FEES.DISCOUNT -
    VNPAY_DISCOUNT;

  const onSubmit = async (data: CheckoutFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 1500)); // Fake API
    console.log("Order Data:", {
      order: items,
      customer: data,
      total: finalPrice,
    });

    toast.success("Đặt hàng thành công! Đang chuyển hướng...", {
      autoClose: 3000,
    });
    clearCart();
    router.replace("/");
  };

  if (!mounted || !isLoggedIn || items.length === 0)
    return <div className="min-h-screen bg-white" />;

  const ErrorMsg = ({ msg }: { msg?: string }) => {
    return msg ? (
      <p className="text-destructive absolute -bottom-4 left-0 mt-1 text-[11px]">
        {msg}
      </p>
    ) : null;
  };

  const SelectStyle =
    "flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none";

  return (
    <main className="mx-auto min-h-[80vh] w-full max-w-360 bg-white px-4 py-8 md:px-8 lg:px-12 lg:py-10 xl:px-16">
      {/* Header Container */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-end">
        <h1 className="text-3xl font-extrabold tracking-tight text-[#0B1A3F] uppercase">
          Thanh toán
        </h1>

        {/* Stepper */}
        <div className="hidden items-center text-sm font-semibold text-gray-400 md:flex">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[11px] text-gray-500">
              1
            </span>
            Giỏ hàng
          </div>
          <div className="mx-4 h-px w-12 bg-gray-200" />
          <div className="text-primary flex items-center gap-2">
            <span className="bg-primary flex h-5 w-5 items-center justify-center rounded-full text-[11px] text-white">
              2
            </span>
            Thanh toán
          </div>
          <div className="mx-4 h-px w-12 bg-gray-200" />
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-[11px] text-gray-500">
              3
            </span>
            Hoàn tất
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit as any)}
        className="flex flex-col gap-8 lg:flex-row lg:gap-12"
      >
        {/* Lõi Cột Trái Form */}
        <div className="w-full space-y-10 lg:w-[65%] xl:w-[68%]">
          {/* Section 1: Thông tin giao hàng */}
          <section>
            <h2 className="font-geist-sans mb-6 text-xl font-bold text-gray-900">
              1. Thông tin giao hàng
            </h2>
            <div className="relative rounded-xl border border-gray-200 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <Button
                type="button"
                variant="link"
                className="text-primary absolute top-4 right-4 px-2 text-sm font-semibold"
              >
                Địa chỉ đã lưu
              </Button>

              <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-6 md:grid-cols-2">
                <div className="relative space-y-1.5 pb-1">
                  <label className="text-sm font-bold text-gray-700">
                    Họ và tên *
                  </label>
                  <Input
                    {...register("fullName")}
                    placeholder="Nguyễn Văn A"
                    className={`h-11 ${errors.fullName ? "border-destructive ring-destructive/20" : ""}`}
                  />
                  <ErrorMsg msg={errors.fullName?.message} />
                </div>
                <div className="relative space-y-1.5 pb-1">
                  <label className="text-sm font-bold text-gray-700">
                    Số điện thoại *
                  </label>
                  <Input
                    {...register("phone")}
                    placeholder="0909 123 456"
                    className={`h-11 ${errors.phone ? "border-destructive ring-destructive/20" : ""}`}
                  />
                  <ErrorMsg msg={errors.phone?.message} />
                </div>

                <div className="relative col-span-1 space-y-1.5 pb-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">
                    Email nhận hóa đơn
                  </label>
                  <Input
                    {...register("email")}
                    placeholder="nguyenva@gmail.com"
                    className={`h-11 ${errors.email ? "border-destructive ring-destructive/20" : ""}`}
                  />
                  <ErrorMsg msg={errors.email?.message} />
                </div>

                <div className="relative space-y-1.5 pb-1">
                  <label className="text-sm font-bold text-gray-700">
                    Tỉnh / Thành phố *
                  </label>
                  <select
                    {...register("city")}
                    className={`${SelectStyle} ${errors.city ? "border-destructive text-destructive" : "text-gray-900"}`}
                  >
                    <option value="" disabled hidden>
                      Chọn Tỉnh/Thành
                    </option>
                    <option value="Hồ Chí Minh">TP. Hồ Chí Minh</option>
                    <option value="Hà Nội">Hà Nội</option>
                    <option value="Đà Nẵng">Đà Nẵng</option>
                  </select>
                  <ErrorMsg msg={errors.city?.message} />
                </div>
                <div className="relative space-y-1.5 pb-1">
                  <label className="text-sm font-bold text-gray-700">
                    Quận / Huyện *
                  </label>
                  <select
                    {...register("district")}
                    className={`${SelectStyle} ${errors.district ? "border-destructive text-destructive" : "text-gray-900"}`}
                  >
                    <option value="" disabled hidden>
                      Chọn Quận/Huyện
                    </option>
                    <option value="Quận 1">Quận 1</option>
                    <option value="Quận 2">Quận Gò Vấp</option>
                    <option value="Bình Thạnh">Bình Thạnh</option>
                  </select>
                  <ErrorMsg msg={errors.district?.message} />
                </div>
                <div className="relative col-span-1 space-y-1.5 pb-1 md:col-span-2 md:w-1/2 md:pr-3">
                  <label className="text-sm font-bold text-gray-700">
                    Phường / Xã *
                  </label>
                  <select
                    {...register("ward")}
                    className={`${SelectStyle} ${errors.ward ? "border-destructive text-destructive" : "text-gray-900"}`}
                  >
                    <option value="" disabled hidden>
                      Chọn Phường/Xã
                    </option>
                    <option value="Phường Bến Nghé">Phường Bến Nghé</option>
                    <option value="Phường 5">Phường 5</option>
                  </select>
                  <ErrorMsg msg={errors.ward?.message} />
                </div>

                <div className="relative col-span-1 space-y-1.5 pb-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">
                    Địa chỉ cụ thể *
                  </label>
                  <Input
                    {...register("addressDetail")}
                    placeholder="69/68 Đặng Thùy Trâm"
                    className={`h-11 ${errors.addressDetail ? "border-destructive ring-destructive/20" : ""}`}
                  />
                  <ErrorMsg msg={errors.addressDetail?.message} />
                </div>

                <div className="col-span-1 mt-2 flex items-center gap-2 md:col-span-2">
                  <div className="flex h-5 items-center">
                    <input
                      id="saveAddress"
                      type="checkbox"
                      {...register("saveAddress")}
                      className="focus:ring-primary/30 accent-primary h-4 w-4 rounded border border-gray-300 bg-gray-50 focus:ring-3"
                    />
                  </div>
                  <label
                    htmlFor="saveAddress"
                    className="cursor-pointer text-sm font-medium text-gray-900 select-none"
                  >
                    Lưu địa chỉ này cho lần mua sau
                  </label>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Phương thức thanh toán */}
          <section>
            <h2 className="font-geist-sans mb-6 text-xl font-bold text-gray-900">
              2. Phương thức thanh toán
            </h2>
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="space-y-4">
                {/* Option 1: COD */}
                <label
                  className={`flex h-16 cursor-pointer items-center rounded-lg border px-4 py-3 transition-all ${selectedPayment === "COD" ? "border-primary ring-primary/20 bg-primary/5 ring-1" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="flex h-5 items-center">
                    <input
                      type="radio"
                      value="COD"
                      {...register("paymentMethod")}
                      className="text-primary focus:ring-primary accent-primary h-4 w-4 border-gray-300 bg-gray-100"
                    />
                  </div>
                  <div className="ms-3 flex grow items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">
                      Thanh toán khi nhận hàng (COD)
                    </span>
                    <Image
                      src="/favicon.ico"
                      alt="COD"
                      width={32}
                      height={20}
                      className="object-contain opacity-50 grayscale"
                    />
                  </div>
                </label>

                {/* Option 2: VNPAY */}
                <label
                  className={`flex h-16 cursor-pointer items-center rounded-lg border px-4 py-3 transition-all ${selectedPayment === "VNPAY" ? "border-primary ring-primary/20 bg-primary/5 ring-1" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="flex h-5 items-center">
                    <input
                      type="radio"
                      value="VNPAY"
                      {...register("paymentMethod")}
                      className="text-primary focus:ring-primary accent-primary h-4 w-4 border-gray-300 bg-gray-100"
                    />
                  </div>
                  <div className="ms-3 flex grow items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">
                        Thanh toán qua VNPAY
                      </span>
                      <span className="text-xs font-bold text-[#00A550]">
                        Giảm thêm 300k
                      </span>
                    </div>
                    <span className="text-xs font-black text-[#005BAA]">
                      VNPAY
                    </span>
                  </div>
                </label>

                {/* Option 3: MOMO */}
                <label
                  className={`flex h-16 cursor-pointer items-center rounded-lg border px-4 py-3 transition-all ${selectedPayment === "MOMO" ? "border-primary ring-primary/20 bg-primary/5 ring-1" : "border-gray-200 hover:border-gray-300"}`}
                >
                  <div className="flex h-5 items-center">
                    <input
                      type="radio"
                      value="MOMO"
                      {...register("paymentMethod")}
                      className="text-primary focus:ring-primary accent-primary h-4 w-4 border-gray-300 bg-gray-100"
                    />
                  </div>
                  <div className="ms-3 flex grow items-center justify-between">
                    <span className="text-sm font-bold text-gray-900">
                      Ví điện tử Momo
                    </span>
                    <span className="text-xs font-black text-[#A50064]">
                      MOMO
                    </span>
                  </div>
                </label>
              </div>
              <ErrorMsg msg={errors.paymentMethod?.message} />
            </div>
          </section>
        </div>

        {/* Cột Phải: Bill tổng quan */}
        <div className="mt-8 w-full lg:mt-0 lg:w-[35%] xl:w-[32%]">
          <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
            <h2 className="mb-6 text-xl font-bold text-gray-900">
              Đơn hàng ({items.reduce((s, i) => s + i.quantity, 0)} sản phẩm)
            </h2>

            {/* List Item */}
            <div className="relative mb-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="line-clamp-2 text-sm leading-tight font-bold text-gray-900">
                      {item.quantity}x {item.name}
                    </p>
                    {item.configName && (
                      <p className="mt-1 truncate text-xs text-gray-500">
                        Màu: Gray | {item.configName}
                      </p>
                    )}
                  </div>
                  <p className="text-xs font-bold whitespace-nowrap text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price detail */}
            <div className="mb-6 space-y-3 border-t border-b border-gray-100 py-4">
              <div className="flex justify-between text-base">
                <span className="font-medium text-gray-600">Tạm tính:</span>
                <span className="font-bold text-gray-900">
                  {formatPrice(getTotalPrice())}
                </span>
              </div>
              <div className="flex justify-between text-base">
                <span className="font-medium text-gray-600">
                  Phí vận chuyển:
                </span>
                <span className="font-bold text-gray-900">
                  {formatPrice(CHECKOUT_FEES.SHIPPING_FEE)}
                </span>
              </div>
              <div className="flex justify-between text-base">
                <span className="font-medium text-gray-600">Giảm giá:</span>
                <span className="font-bold text-[#00A550]">
                  {VNPAY_DISCOUNT > 0
                    ? `- ${formatPrice(VNPAY_DISCOUNT)}`
                    : "- 0đ"}
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="mb-6 flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-xl font-black text-gray-900">
                  Tổng cộng:
                </span>
                <span className="mt-0.5 text-[11px] text-gray-400">
                  (Đã bao gồm VAT)
                </span>
              </div>
              <div className="text-2xl font-black tracking-tight text-[#E30019]">
                {formatPrice(finalPrice)}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-14 w-full rounded-lg bg-[#E30019] text-lg font-bold text-white shadow-lg shadow-red-500/20 transition-all hover:bg-[#CC0014] active:scale-[0.98]"
            >
              {isSubmitting ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
            </Button>

            <p className="mt-4 px-2 text-center text-[11px] leading-relaxed text-gray-500">
              Nhấn "Đặt hàng" đồng nghĩa với việc <br />
              <a
                href="#"
                className="text-primary font-semibold hover:underline"
              >
                đồng ý với điều khoản NetTech
              </a>
            </p>
          </div>
        </div>
      </form>
    </main>
  );
}
