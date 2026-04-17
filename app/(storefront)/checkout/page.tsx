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
import { addressApi, UserAddress } from "@/features/storefront/address/api/addressApi";
import { vietnamProvincesApi, VietnamProvince, VietnamDistrict, VietnamWard } from "@/features/storefront/address/api/vietnamProvincesApi";
import { CHECKOUT_FEES } from "@/constants/checkout";
import {
  checkoutSchema,
  CheckoutFormData,
} from "@/features/storefront/checkout/utils/validation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Stepper } from "@/components/ui/stepper";
import { Check } from "lucide-react";
import { AddressModal } from "@/features/storefront/address/components/AddressModal";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [mounted, setMounted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderResult, setOrderResult] = useState<{
    orderId: string;
    customer: CheckoutFormData;
    total: number;
  } | null>(null);

  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedSavedAddrId, setSelectedSavedAddrId] = useState<string | undefined>();

  // Dữ liệu API Hành chính
  const [provinces, setProvinces] = useState<VietnamProvince[]>([]);
  const [districts, setDistricts] = useState<VietnamDistrict[]>([]);
  const [wards, setWards] = useState<VietnamWard[]>([]);

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

  const { onChange: onCityRegChange, ...restCityReg } = register("city");
  const { onChange: onDistrictRegChange, ...restDistrictReg } = register("district");
  const { onChange: onWardRegChange, ...restWardReg } = register("ward");

  const selectedCity = watch("city");
  const selectedDistrict = watch("district");
  const selectedWard = watch("ward");
  const selectedPayment = watch("paymentMethod");

  useEffect(() => {
    setMounted(true);
    // Nếu chưa đăng nhập, đá về trang login
    if (!useAuthStore.getState().isLoggedIn) {
      toast.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      router.replace("/login");
    } else if (useCartStore.getState().items.length === 0 && !isSuccess) {
      toast.warning("Giỏ hàng của bạn đang trống!");
      router.replace("/cart");
    }

    // Tải mảng địa chỉ ngay khi mount
    addressApi.getSavedAddresses().then(setSavedAddresses);
    
    // Tải danh sách tỉnh thành
    vietnamProvincesApi.getProvinces().then(setProvinces);
  }, [router, isSuccess]);

  // Load districts when city changes
  useEffect(() => {
    if (!selectedCity) return;
    const normalizedSelectedCity = selectedCity.normalize("NFC");
    const provinceId = provinces.find(p => p.name.normalize("NFC") === normalizedSelectedCity)?.code;
    
    if (provinceId) {
      vietnamProvincesApi.getDistricts(provinceId).then(setDistricts);
    } else {
      setDistricts([]);
    }
  }, [selectedCity, provinces]);

  // Load wards when district changes
  useEffect(() => {
    if (!selectedDistrict) return;
    const normalizedSelectedDistrict = selectedDistrict.normalize("NFC");
    const districtId = districts.find(d => d.name.normalize("NFC") === normalizedSelectedDistrict)?.code;

    if (districtId) {
      vietnamProvincesApi.getWards(districtId).then(setWards);
    } else {
      setWards([]);
    }
  }, [selectedDistrict, districts]);

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
    
    // Nếu user tích chọn lưu địa chỉ, lưu xuống API qua LocalStorage mock
    if (data.saveAddress) {
      await addressApi.saveAddress({
        fullName: data.fullName,
        phone: data.phone,
        city: data.city,
        district: data.district,
        ward: data.ward,
        addressDetail: data.addressDetail,
        isDefault: false
      });
      addressApi.getSavedAddresses().then(setSavedAddresses);
    }

    const generatedOrderId = `#NT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const orderData = {
      orderId: generatedOrderId,
      customer: data,
      total: finalPrice,
    };

    console.log("Order Data:", {
      order: items,
      ...orderData,
    });

    toast.success("Đặt hàng thành công!", {
      autoClose: 3000,
    });

    setOrderResult(orderData);
    setIsSuccess(true);
    clearCart();
  };

  if (!mounted || !isLoggedIn || (items.length === 0 && !isSuccess))
    return <div className="min-h-screen bg-white" />;

  const ErrorMsg = ({ msg }: { msg?: string }) => {
    return msg ? (
      <p className="text-destructive absolute -bottom-4 left-0 mt-1 text-[11px]">
        {msg}
      </p>
    ) : null;
  };

  if (isSuccess && orderResult) {
    return (
      <main className="mx-auto flex min-h-[80vh] w-full max-w-360 flex-col items-center bg-white px-4 py-8 md:px-8 lg:px-12 lg:py-10 xl:px-16">
        {/* Header Container */}
        <div className="mb-12 flex w-full justify-end">
          <Stepper currentStep={3} />
        </div>

        {/* Success Icon */}
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 md:h-24 md:w-24">
          <Check
            strokeWidth={3}
            className="h-10 w-10 text-green-500 md:h-12 md:w-12"
          />
        </div>

        {/* Title */}
        <h1 className="mb-3 text-center text-2xl font-black tracking-tight text-[#1cc55e] uppercase md:text-3xl">
          Đặt hàng thành công!
        </h1>
        <p className="mb-6 text-center text-sm font-bold text-gray-700 md:text-base">
          Cảm ơn bạn đã mua hàng tại NetTech. Đơn hàng của bạn đang được xử lý.
        </p>

        {/* Order ID Tag */}
        <div className="mb-10 rounded-lg border border-gray-100 bg-gray-50/80 px-4 py-2 text-sm font-bold text-gray-500 shadow-sm md:px-6 md:py-3">
          Mã đơn hàng:{" "}
          <span className="text-primary">{orderResult.orderId}</span>
        </div>

        {/* Order Info Card */}
        <div className="w-full max-w-200 overflow-hidden rounded-xl border border-gray-100 text-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)] md:text-base">
          <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
            <h2 className="font-bold text-gray-900">Thông tin nhận hàng</h2>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 md:gap-8">
            <div className="space-y-4">
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-500">
                  Người nhận:
                </p>
                <p className="font-bold text-gray-900">
                  {orderResult.customer.fullName}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-500">
                  Số điện thoại:
                </p>
                <p className="font-bold text-gray-900">
                  {orderResult.customer.phone}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-500">
                  Địa chỉ giao hàng:
                </p>
                <p className="leading-snug font-bold text-gray-900">
                  {orderResult.customer.addressDetail}, <br />{" "}
                  {orderResult.customer.ward}, {orderResult.customer.district},{" "}
                  {orderResult.customer.city}
                </p>
              </div>
            </div>

            <div className="flex flex-col space-y-4 md:border-l md:border-dashed md:border-gray-200 md:pl-8">
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-500">
                  Phương thức thanh toán:
                </p>
                <p className="font-bold text-gray-900">
                  {orderResult.customer.paymentMethod === "COD"
                    ? "Thanh toán khi nhận hàng (COD)"
                    : orderResult.customer.paymentMethod === "VNPAY"
                      ? "Thanh toán qua VNPAY"
                      : "Ví điện tử MOMO"}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-semibold text-gray-500">
                  Trạng thái thanh toán:
                </p>
                <p className="font-bold text-orange-500">
                  {orderResult.customer.paymentMethod === "COD"
                    ? "Chờ thanh toán"
                    : "Đã thanh toán (Chờ xác nhận)"}
                </p>
              </div>
              <div className="mt-auto border-t border-dashed border-gray-100 pt-4">
                <p className="mb-1 text-xs font-semibold text-gray-500">
                  Tổng thanh toán:
                </p>
                <p className="text-destructive text-2xl leading-none font-black md:text-[28px]">
                  {formatPrice(orderResult.total)}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-green-100/50 bg-[#f0fcf4] px-6 py-4 text-xs text-[#0c8f49] md:text-sm">
            <span className="font-bold">Lưu ý:</span>
            <br className="md:hidden" /> NetTech sẽ gửi email xác nhận đơn hàng
            đến{" "}
            <span className="font-bold">
              {orderResult.customer.email || "email của bạn"}
            </span>{" "}
            trong ít phút nữa.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 mb-10 flex w-full flex-col items-center justify-center gap-4 sm:flex-row">

          <Link href="/">
            <Button
              variant="outline"
              className="text-primary border-primary hover:bg-primary/5 h-12 w-full min-w-50 rounded-full border text-sm font-bold uppercase transition-all sm:w-auto"
            >
              TIẾP TỤC MUA SẮM
            </Button>
          </Link>
        </div>
      </main>
    );
  }

  const SelectStyle =
    "flex h-11 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none";

  return (
    <main className="mx-auto min-h-[80vh] w-full max-w-360 bg-white px-4 py-8 md:px-8 lg:px-12 lg:py-10 xl:px-16">
      {/* Header Container */}
      <div className="mb-10 flex flex-col items-start justify-between gap-4 border-b border-gray-100 pb-4 md:flex-row md:items-end">
        <h1 className="text-heading text-3xl font-extrabold tracking-tight uppercase">
          Thanh toán
        </h1>

        {/* Stepper */}
        <Stepper currentStep={2} />
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
                onClick={() => setIsAddressModalOpen(true)}
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
                    {...restCityReg}
                    value={selectedCity || ""}
                    onChange={(e) => {
                      onCityRegChange(e);
                      setValue("district", "");
                      setValue("ward", "");
                    }}
                    className={`${SelectStyle} ${errors.city ? "border-destructive text-destructive" : "text-gray-900"}`}
                  >
                    <option value="" disabled hidden>
                      Chọn Tỉnh/Thành
                    </option>
                    {provinces.map(p => (
                      <option key={p.code} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                  <ErrorMsg msg={errors.city?.message} />
                </div>
                <div className="relative space-y-1.5 pb-1">
                  <label className="text-sm font-bold text-gray-700">
                    Quận / Huyện *
                  </label>
                  <select
                    {...restDistrictReg}
                    value={selectedDistrict || ""}
                    onChange={(e) => {
                      onDistrictRegChange(e);
                      setValue("ward", "");
                    }}
                    className={`${SelectStyle} ${errors.district ? "border-destructive text-destructive" : "text-gray-900"}`}
                  >
                    <option value="" disabled hidden>
                      Chọn Quận/Huyện
                    </option>
                    {districts.map(d => (
                      <option key={d.code} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                  <ErrorMsg msg={errors.district?.message} />
                </div>
                <div className="relative col-span-1 space-y-1.5 pb-1 md:col-span-2 md:w-1/2 md:pr-3">
                  <label className="text-sm font-bold text-gray-700">
                    Phường / Xã *
                  </label>
                  <select
                    {...restWardReg}
                    value={selectedWard || ""}
                    onChange={(e) => {
                      onWardRegChange(e);
                    }}
                    className={`${SelectStyle} ${errors.ward ? "border-destructive text-destructive" : "text-gray-900"}`}
                  >
                    <option value="" disabled hidden>
                      Chọn Phường/Xã
                    </option>
                    {wards.map(w => (
                      <option key={w.code} value={w.name}>{w.name}</option>
                    ))}
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
                      <span className="text-success text-xs font-bold">
                        Giảm thêm 300k
                      </span>
                    </div>
                    <span className="text-vnpay text-xs font-black">VNPAY</span>
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
                    <span className="text-momo text-xs font-black">MOMO</span>
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
                <span className="text-success font-bold">
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
              <div className="text-destructive text-2xl font-black tracking-tight">
                {formatPrice(finalPrice)}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-destructive shadow-destructive/20 hover:bg-destructive/90 h-14 w-full rounded-lg text-lg font-bold text-white shadow-lg transition-all active:scale-[0.98]"
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

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        addresses={savedAddresses}
        selectedId={selectedSavedAddrId}
        onSelect={(addr) => {
          setSelectedSavedAddrId(addr.id);
          setValue("fullName", addr.fullName, { shouldValidate: true });
          setValue("phone", addr.phone, { shouldValidate: true });
          setValue("city", addr.city, { shouldValidate: true });
          setValue("district", addr.district, { shouldValidate: true });
          setValue("ward", addr.ward, { shouldValidate: true });
          setValue("addressDetail", addr.addressDetail, { shouldValidate: true });
          setIsAddressModalOpen(false);
        }}
      />
    </main>
  );
}
