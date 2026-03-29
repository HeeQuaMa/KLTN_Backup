"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/useCartStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Minus, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalItems, getTotalPrice } = useCartStore();
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
    <main className="mx-auto w-full max-w-[1440px] px-4 py-8 md:px-8 lg:px-12 xl:px-16 lg:py-10 flex-1 bg-gray-50/30">
      {/* Header Giỏ hàng */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <h1 className="text-2xl md:text-[28px] font-extrabold uppercase text-gray-900 tracking-tight flex items-baseline gap-2">
          Giỏ hàng của bạn 
          <span className="text-sm font-normal text-gray-500 normal-case">({getTotalItems()} sản phẩm)</span>
        </h1>
        
        {/* Stepper (Chỉ hiện trên Desktop/Tablet) */}
        <div className="hidden md:flex items-center text-sm font-medium text-gray-500">
          <div className="flex items-center gap-2 text-primary">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-white">1</span>
            Giỏ hàng
          </div>
          <div className="mx-4 h-px w-10 bg-gray-300" />
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs">2</span>
            Thanh toán
          </div>
          <div className="mx-4 h-px w-10 bg-gray-300" />
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs">3</span>
            Hoàn tất
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cột Trái: Danh sách Sản phẩm */}
        <div className="w-full lg:w-[65%] xl:w-[70%]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white py-16 text-center">
              <div className="mb-4 text-gray-300">
                <ShieldCheck className="mx-auto h-16 w-16" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Giỏ hàng rỗng</h3>
              <p className="mt-2 text-gray-500">Có vẻ như bạn chưa chọn sản phẩm nào.</p>
              <Link href="/">
                <Button className="mt-6 bg-primary hover:bg-primary-hover/90">
                  <ArrowLeft className="mr-2 h-4 w-4" /> Tiếp tục khám phá
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {/* Table Header (ẩn ở mobile) */}
              <div className="hidden md:grid grid-cols-12 gap-4 rounded-xl bg-gray-100/80 px-4 py-3 text-xs font-bold text-gray-500 uppercase">
                <div className="col-span-6">Sản phẩm</div>
                <div className="col-span-2 text-center">Đơn giá</div>
                <div className="col-span-2 text-center">Số lượng</div>
                <div className="col-span-2 text-right">Thành tiền</div>
              </div>

              {/* Danh sách Items */}
              {items.map((item) => (
                <div 
                  key={item.cartItemId} 
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm relative group"
                >
                  {/* Nút Xoá (Mobile & Desktop) */}
                  <button 
                    onClick={() => removeItem(item.cartItemId)}
                    className="absolute right-4 top-4 md:top-1/2 md:-translate-y-1/2 text-gray-300 hover:text-destructive transition-colors md:opacity-0 group-hover:opacity-100"
                    title="Xoá sản phẩm"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>

                  {/* SP Info */}
                  <div className="col-span-1 md:col-span-6 flex gap-4 pr-6 md:pr-0">
                    <div className="relative h-20 w-20 md:h-24 md:w-24 shrink-0 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center p-2">
                      <Image 
                        src={item.image} 
                        alt={item.name} 
                        fill 
                        className="object-contain p-2 mix-blend-multiply" 
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <h3 className="text-sm md:text-base font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {item.name}
                      </h3>
                      {item.configName && (
                        <p className="mt-1 text-xs text-gray-500">Cấu hình: {item.configName}</p>
                      )}
                      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-green-600">
                        <CheckCircle2 className="h-3 w-3" /> Còn hàng
                      </div>
                    </div>
                  </div>

                  {/* Đơn giá (ẩn ở mobile, chuyển lên thành tiền) */}
                  <div className="hidden md:flex col-span-2 flex-col items-center justify-center">
                    <span className="font-bold text-gray-900">{formatPrice(item.price)}</span>
                  </div>

                  {/* Số lượng */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-center">
                    <span className="md:hidden text-sm font-semibold text-gray-500">Số lượng:</span>
                    <div className="flex items-center rounded-md border border-gray-200 bg-white md:bg-gray-50/50">
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex h-8 w-8 items-center justify-center text-sm font-semibold">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Thành tiền */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end md:pr-8">
                    <span className="md:hidden text-sm font-semibold text-gray-500">Thành tiền:</span>
                    <span className="font-bold text-destructive md:text-lg">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}

              <div className="mt-4">
                <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
                  <ArrowLeft className="h-4 w-4" /> Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Cột Phải: Tổng quan đơn hàng */}
        {items.length > 0 && (
          <div className="w-full lg:w-[35%] xl:w-[30%]">
            <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden sticky top-6">
              <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4">
                <h2 className="text-lg font-bold text-gray-900 uppercase">Tổng quan đơn hàng</h2>
              </div>
              
              <div className="p-6">
                <div className="flex justify-between text-sm text-gray-600 mb-4">
                  <span>Tạm tính:</span>
                  <span className="font-bold text-gray-900">{formatPrice(getTotalPrice())}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600 mb-6">
                  <span>Giảm giá:</span>
                  <span className="font-bold text-green-600">- 0đ</span>
                </div>

                {/* Input Khuyến mãi */}
                <div className="flex gap-2 mb-6 border-b border-dashed border-gray-200 pb-6">
                  <Input placeholder="Nhập mã khuyến mãi" className="h-10 text-sm focus-visible:ring-primary/20" />
                  <Button variant="secondary" className="h-10 font-bold bg-primary text-white hover:bg-primary-hover/90 cursor-pointer">
                    ÁP DỤNG
                  </Button>
                </div>

                <div className="mb-6 flex justify-between items-end">
                  <span className="text-base font-bold text-gray-900">Tổng cộng:</span>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-destructive leading-none">
                      {formatPrice(getTotalPrice())}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-1">(Đã bao gồm VAT)</span>
                  </div>
                </div>

                <Button className="w-full h-14 cursor-pointer text-lg font-bold uppercase tracking-wide bg-destructive hover:bg-destructive/90 text-white shadow-lg shadow-destructive/20 hover:-translate-y-0.5 transition-all">
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
