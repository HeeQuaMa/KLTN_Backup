"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore"; 
import { useCart } from "@/features/storefront/cart/context/CartContext";
import { createOrder, mapCartItemsToOrderItems, hasMockItems } from "@/lib/api/orderApi";
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
  const { items, totalPrice, clearCart } = useCart();
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  
  // ==========================================
  // 1. LẤY DISCOUNT TỪ ZUSTAND STORE
  // ==========================================
  const { discountAmount, appliedVoucher, resetVoucher } = useCartStore();

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
  const [provinces, setProvinces] = useState<VietnamProvince[]>([]);
  const [districts, setDistricts] = useState<VietnamDistrict[]>([]);
  const [wards, setWards] = useState<VietnamWard[]>([]);

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
      fullName: "", phone: "", email: "", city: "", district: "", ward: "",
      addressDetail: "", saveAddress: false, paymentMethod: "COD",
    },
  });

  const selectedCity = watch("city");
  const selectedDistrict = watch("district");
  const selectedPayment = watch("paymentMethod");

  useEffect(() => {
    setMounted(true);
    if (!useAuthStore.getState().isLoggedIn) {
      toast.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      router.replace("/login");
    } else if (items.length === 0 && !isSuccess) {
      router.replace("/cart");
    }
    addressApi.getSavedAddresses().then(setSavedAddresses);
    vietnamProvincesApi.getProvinces().then(setProvinces);
  }, [router, isSuccess, items.length]);

  // Load districts
  useEffect(() => {
    if (!selectedCity) return;
    const provinceId = provinces.find(p => p.name.normalize("NFC") === selectedCity.normalize("NFC"))?.code;
    if (provinceId) vietnamProvincesApi.getDistricts(provinceId).then(setDistricts);
  }, [selectedCity, provinces]);

  // Load wards
  useEffect(() => {
    if (!selectedDistrict) return;
    const districtId = districts.find(d => d.name.normalize("NFC") === selectedDistrict.normalize("NFC"))?.code;
    if (districtId) vietnamProvincesApi.getWards(districtId).then(setWards);
  }, [selectedDistrict, districts]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
  };

  const VNPAY_DISCOUNT = selectedPayment === "VNPAY" ? CHECKOUT_FEES.VNPAY_DISCOUNT_AMOUNT : 0;
  
  // ==========================================
  // 2. CÔNG THỨC TÍNH TỔNG (TRỪ DISCOUNT TỪ STORE)
  // ==========================================
  const totalDiscount = discountAmount + VNPAY_DISCOUNT;
  const finalPrice = totalPrice + CHECKOUT_FEES.SHIPPING_FEE - totalDiscount;

  const onSubmit = async (data: CheckoutFormData) => {
    if (data.saveAddress) {
      await addressApi.saveAddress({ ...data, isDefault: false });
    }

    const userId = useAuthStore.getState().user?.id ?? "";
    let generatedOrderId = `#NT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const realItems = mapCartItemsToOrderItems(items);
    if (realItems.length > 0 && userId) {
      try {
        const result = await createOrder({
          userId,
          items: realItems,
          totalAmount: finalPrice,
          customerInfo: { ...data, paymentMethod: data.paymentMethod as any },
        });
        if (result._id) generatedOrderId = result._id;
      } catch (e) { console.error(e); }
    }

    toast.success("Đặt hàng thành công!");
    setOrderResult({ orderId: generatedOrderId, customer: data, total: finalPrice });
    setIsSuccess(true);
    
    // Dọn dẹp giỏ hàng và reset mã voucher sau khi mua xong
    await clearCart();
    resetVoucher(); 
  };

  if (!mounted || !isLoggedIn || (items.length === 0 && !isSuccess))
    return <div className="min-h-screen bg-white" />;

  if (isSuccess && orderResult) {
    return (
      <main className="mx-auto flex min-h-[80vh] w-full max-w-360 flex-col items-center bg-white px-4 py-8 md:px-16">
        <Stepper currentStep={3} />
        <div className="mt-10 mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
          <Check strokeWidth={3} className="h-12 w-12 text-green-500" />
        </div>
        <h1 className="mb-3 text-2xl font-black text-[#1cc55e] uppercase">Đặt hàng thành công!</h1>
        <div className="mb-10 rounded-lg border bg-gray-50 px-6 py-3 text-sm font-bold">
          Mã đơn hàng: <span className="text-primary">{orderResult.orderId}</span>
        </div>
        <div className="w-full max-w-200 rounded-xl border p-6 shadow-sm">
          <p className="font-bold text-lg mb-4 text-center">Tổng thanh toán: {formatPrice(orderResult.total)}</p>
          <Link href="/"><Button className="w-full h-12 rounded-full">TIẾP TỤC MUA SẮM</Button></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[80vh] w-full max-w-360 bg-white px-4 py-8 md:px-16">
      <div className="mb-10 flex justify-between items-end border-b pb-4">
        <h1 className="text-3xl font-extrabold uppercase">Thanh toán</h1>
        <Stepper currentStep={2} />
      </div>

      <form onSubmit={handleSubmit(onSubmit as any)} className="flex flex-col gap-8 lg:flex-row">
        <div className="w-full space-y-10 lg:w-[65%]">
           {/* Section 1: Thông tin giao hàng */}
           <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">1. Thông tin giao hàng</h2>
                <Button type="button" variant="link" onClick={() => setIsAddressModalOpen(true)} className="text-primary">Địa chỉ đã lưu</Button>
              </div>
              <div className="grid grid-cols-2 gap-4 p-6 border rounded-xl bg-white">
                 <Input {...register("fullName")} placeholder="Họ và tên *" className="h-11" />
                 <Input {...register("phone")} placeholder="Số điện thoại *" className="h-11" />
                 <Input {...register("email")} placeholder="Email nhận hóa đơn" className="col-span-2 h-11" />
                 <select {...register("city")} className="h-11 border rounded-md px-3 text-sm">
                    <option value="">Chọn Tỉnh/Thành</option>
                    {provinces.map(p => <option key={p.code} value={p.name}>{p.name}</option>)}
                 </select>
                 <select {...register("district")} className="h-11 border rounded-md px-3 text-sm">
                    <option value="">Chọn Quận/Huyện</option>
                    {districts.map(d => <option key={d.code} value={d.name}>{d.name}</option>)}
                 </select>
                 <Input {...register("addressDetail")} placeholder="Địa chỉ cụ thể *" className="col-span-2 h-11" />
              </div>
           </section>

           {/* Section 2: Phương thức thanh toán */}
           <section className="mt-8">
              <h2 className="text-xl font-bold mb-6">2. Phương thức thanh toán</h2>
              <div className="space-y-4">
                 <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${selectedPayment === 'COD' ? 'border-primary bg-primary/5' : ''}`}>
                    <input type="radio" value="COD" {...register("paymentMethod")} className="mr-3 accent-primary" />
                    <span className="font-bold text-sm">Thanh toán khi nhận hàng (COD)</span>
                 </label>
                 <label className={`flex items-center p-4 border rounded-lg cursor-pointer ${selectedPayment === 'VNPAY' ? 'border-primary bg-primary/5' : ''}`}>
                    <input type="radio" value="VNPAY" {...register("paymentMethod")} className="mr-3 accent-primary" />
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">Thanh toán qua VNPAY</span>
                      <span className="text-green-600 text-xs font-bold italic">Giảm thêm 300k</span>
                    </div>
                 </label>
              </div>
           </section>
        </div>

        {/* Bill Tổng quan */}
        <div className="w-full lg:w-[35%]">
          <div className="sticky top-6 rounded-xl border p-6 bg-white shadow-lg">
            <h2 className="mb-6 text-xl font-bold">Đơn hàng ({items.length})</h2>
            
            <div className="space-y-4 mb-6 max-h-40 overflow-y-auto">
              {items.map((item) => (
                <div key={item.cartItemId} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate mr-2">{item.quantity}x {item.name}</span>
                  <span className="font-bold whitespace-nowrap">{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3 border-t pt-4">
              <div className="flex justify-between text-sm">
                <span>Tạm tính:</span>
                <span className="font-bold">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Phí vận chuyển:</span>
                <span className="font-bold">{formatPrice(CHECKOUT_FEES.SHIPPING_FEE)}</span>
              </div>
              
              {/* PHẦN HIỂN THỊ GIẢM GIÁ TỔNG HỢP */}
              <div className="flex justify-between text-sm text-green-600">
                <span className="font-medium">Giảm giá:</span>
                <span className="font-bold">
                  {totalDiscount > 0 ? `- ${formatPrice(totalDiscount)}` : "0 đ"}
                </span>
              </div>
              {appliedVoucher && (
                <p className="text-[10px] text-green-500 text-right italic">
                  (Mã: {appliedVoucher})
                </p>
              )}
            </div>

            <div className="mt-6 flex justify-between items-end border-t pt-4">
              <span className="text-lg font-bold">Tổng cộng:</span>
              <span className="text-destructive text-2xl font-black">
                {formatPrice(finalPrice)}
              </span>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-6 w-full h-14 bg-destructive text-lg font-bold text-white uppercase shadow-lg transition-transform active:scale-95"
            >
              {isSubmitting ? "ĐANG XỬ LÝ..." : "ĐẶT HÀNG"}
            </Button>
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
          setValue("fullName", addr.fullName);
          setValue("phone", addr.phone);
          setValue("city", addr.city);
          setValue("district", addr.district);
          setValue("addressDetail", addr.addressDetail);
          setIsAddressModalOpen(false);
        }}
      />
    </main>
  );
}