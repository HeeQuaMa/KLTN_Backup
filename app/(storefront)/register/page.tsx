"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerSchema, RegisterFormData } from "@/features/auth/utils/validation";
import { authApi } from "@/features/auth/api/authApi";

export default function RegisterPage() {
  const router = useRouter();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterFormData>({
    // @ts-ignore
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: "", email: "", phone: "", password: "", confirmPassword: "", agreeTerms: false }
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await authApi.register({
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });
      
      toast.success("Tạo tài khoản thành công!", { autoClose: 2000 });
      router.push("/login");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.");
    }
  };

  return (
    <AuthLayout title="Tạo tài khoản NETTECH">
      <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-4">
        
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Họ và tên *</label>
          <Input 
            {...register("fullName")}
            placeholder="Ví dụ: Nguyễn Văn A" 
            className="h-10 text-sm focus-visible:ring-primary/20"
          />
          {errors.fullName && <p className="text-[11px] text-destructive mt-1">{errors.fullName.message}</p>}
        </div>

        {/* Email */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Email *</label>
          <Input 
            {...register("email")}
            placeholder="Địa chỉ email của bạn" 
            className="h-10 text-sm focus-visible:ring-primary/20"
          />
          {errors.email && <p className="text-[11px] text-destructive mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Số điện thoại *</label>
          <Input 
            {...register("phone")}
            placeholder="SĐT để bảo hành & tích điểm" 
            className="h-10 text-sm focus-visible:ring-primary/20"
          />
          {errors.phone && <p className="text-[11px] text-destructive mt-1">{errors.phone.message}</p>}
        </div>

        {/* Password Input */}
        <div className="space-y-1 pb-1">
          <label className="text-xs font-bold text-gray-700">Mật khẩu *</label>
          <Input 
            {...register("password")}
            type="password" 
            placeholder="••••••••••••" 
            className="h-10 text-sm tracking-widest focus-visible:ring-primary/20"
          />
          {errors.password ? (
            <p className="text-[11px] text-destructive mt-1">{errors.password.message}</p>
          ) : (
            <p className="text-[10px] text-gray-400 mt-1">Từ 8-25 ký tự, bao gồm chữ hoa, chữ thường và số.</p>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-700">Nhập lại mật khẩu *</label>
          <Input 
            {...register("confirmPassword")}
            type="password" 
            placeholder="••••••••••••" 
            className="h-10 text-sm tracking-widest focus-visible:ring-primary/20"
          />
          {errors.confirmPassword && <p className="text-[11px] text-destructive mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Checkboxes */}
        <div className="space-y-2 pt-2 pb-3">
          <label className="flex items-start gap-2 cursor-pointer text-xs">
            <input type="checkbox" {...register("agreeTerms")} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary" />
            <span className="text-gray-600">
              Tôi đồng ý với <Link href="#" className="text-primary hover:underline">Chính sách bảo mật</Link> và <Link href="#" className="text-primary hover:underline">Điều khoản sử dụng</Link> của NetTech.
            </span>
          </label>
          {errors.agreeTerms && <p className="text-[11px] text-destructive ml-6">{errors.agreeTerms.message as string}</p>}
          
          <label className="flex items-start gap-2 cursor-pointer text-xs">
            <input type="checkbox" {...register("subscribe")} className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary" />
            <span className="text-gray-600">Đăng ký nhận tin tức khuyến mãi (Tùy chọn).</span>
          </label>
        </div>

        {/* Signup Button */}
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-11 text-sm font-bold bg-primary hover:bg-primary-hover text-white"
        >
          {isSubmitting ? "ĐANG XỬ LÝ..." : "ĐĂNG KÝ"}
        </Button>

        {/* Separator */}
        <div className="relative mt-8 mb-4 border-t border-gray-100" />

        {/* Sign in Link */}
        <div className="text-center text-xs font-medium text-gray-700">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            Đăng nhập
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
