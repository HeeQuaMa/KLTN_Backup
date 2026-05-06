"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

import { AuthLayout } from "@/components/layouts/storefront/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  registerSchema,
  RegisterFormData,
} from "@/features/shared/auth/utils/validation";
import { registerApi } from "@/features/auth/api/auth.api";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    // @ts-ignore
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      agreeTerms: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      // 1. Gọi API đăng ký
      await registerApi(data);
      
      // 2. Nếu code chạy xuống đây tức là API gọi thành công (Status 200/201)
      toast.success("Đăng ký tài khoản thành công!");
      router.push("/login"); // Chuyển hướng sang trang đăng nhập

    } catch (error: any) {
      // 3. NẾU CÓ LỖI (Trùng SĐT, Email, Backend sập...) nó sẽ nhảy vào đây
      
      // Lấy câu báo lỗi từ Backend (nếu Backend có cấu hình ném lỗi đàng hoàng)
      // Nếu Backend trả 500 không có message, thì dùng câu mặc định
      const errorMessage = 
        error.response?.data?.message || 
        "Đăng ký thất bại! Số điện thoại hoặc Email này có thể đã được sử dụng.";

      // Bắn Toast màu đỏ chửi lên góc màn hình
      toast.error(errorMessage);
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản NETTECH">
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Email *</label>
          <Input
            {...register("email")}
            placeholder="Địa chỉ email của bạn"
            className="focus-visible:ring-primary/20 h-10 text-sm"
          />
          {errors.email && (
            <p className="text-destructive mt-1 text-[11px]">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Họ và tên *</label>
          <Input
            {...register("fullName")}
            placeholder="Nhập họ và tên của bạn"
            className="focus-visible:ring-primary/20 h-10 text-sm"
          />
          {errors.fullName && (
            <p className="text-destructive mt-1 text-[11px]">
              {errors.fullName.message}
            </p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">
            Số điện thoại *
          </label>
          <Input
            {...register("phone")}
            placeholder="SĐT để bảo hành & tích điểm"
            className="focus-visible:ring-primary/20 h-10 text-sm"
          />
          {errors.phone && (
            <p className="text-destructive mt-1 text-[11px]">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1 pb-1">
          <label className="text-xs font-bold text-gray-700">Mật khẩu *</label>
          <Input
            {...register("password")}
            type="password"
            placeholder="••••••••••••"
            className="focus-visible:ring-primary/20 h-10 text-sm tracking-widest"
          />
          {errors.password ? (
            <p className="text-destructive mt-1 text-[11px]">
              {errors.password.message}
            </p>
          ) : (
            <p className="mt-1 text-[10px] text-gray-400">
              Từ 8-25 ký tự, bao gồm chữ hoa, chữ thường và số.
            </p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">
            Nhập lại mật khẩu *
          </label>
          <Input
            {...register("confirmPassword")}
            type="password"
            placeholder="••••••••••••"
            className="focus-visible:ring-primary/20 h-10 text-sm tracking-widest"
          />
          {errors.confirmPassword && (
            <p className="text-destructive mt-1 text-[11px]">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Checkboxes */}
        <div className="space-y-2 pt-2 pb-3">
          <label className="flex cursor-pointer items-start gap-2 text-xs">
            <input
              type="checkbox"
              {...register("agreeTerms")}
              className="text-primary mt-0.5 h-4 w-4 rounded border-gray-300"
            />
            <span className="text-gray-600">
              Tôi đồng ý với{" "}
              <Link href="#" className="text-primary hover:underline">
                Chính sách bảo mật
              </Link>{" "}
              và{" "}
              <Link href="#" className="text-primary hover:underline">
                Điều khoản sử dụng
              </Link>{" "}
              của NetTech.
            </span>
          </label>
          {errors.agreeTerms && (
            <p className="text-destructive ml-6 text-[11px]">
              {errors.agreeTerms.message as string}
            </p>
          )}

          <label className="flex cursor-pointer items-start gap-2 text-xs">
            <input
              type="checkbox"
              {...register("subscribe")}
              className="text-primary mt-0.5 h-4 w-4 rounded border-gray-300"
            />
            <span className="text-gray-600">
              Đăng ký nhận tin tức khuyến mãi (Tùy chọn).
            </span>
          </label>
        </div>

        {/* Signup Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary-hover h-11 w-full text-sm font-bold text-white"
        >
          {isSubmitting ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
        </Button>

        {/* Separator */}
        <div className="relative mt-8 mb-4 border-t border-gray-100" />

        {/* Sign in Link */}
        <div className="text-center text-xs font-medium text-gray-700">
          Đã có tài khoản?{" "}
          <Link
            href="/login"
            className="text-primary font-bold hover:underline"
          >
            Đăng nhập
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
