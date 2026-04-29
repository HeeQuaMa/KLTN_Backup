"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";

import { AuthLayout } from "@/components/layouts/storefront/AuthLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, LoginFormData } from "@/features/shared/auth/utils/validation";
import { authApi } from "@/features/shared/auth/api/authApi";
import { decodeJwtPayload } from "@/lib/utils";

import { loginApi } from "@/features/auth/api/auth.api";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    // @ ts-ignore
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrPhone: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      // 1. Gọi API đăng nhập thật
      const res = await authApi.login(data);

      // 2. Lưu token vào localStorage để duy trì đăng nhập (Lấy từ nhánh feature/BN-BE của bạn)
      localStorage.setItem("access_token", res.access_token);

      // 3. Giải mã JWT để lấy _id (Lấy từ nhánh HEAD để đảm bảo logic lưu store không bị lỗi)
      const decoded = decodeJwtPayload<{ id: string; email: string; role: string }>(
        res.access_token,
      );

      // 4. Lưu thông tin User vào Zustand
      login({
        _id: decoded?.id ?? null,
        email: res.user?.email ?? data.emailOrPhone,
        fullName: res.user?.fullName ?? "",
        role: res.user?.role ?? "CUSTOMER",
        access_token: res.access_token,
      });

      toast.success(`Chào mừng ${res.user?.fullName ?? "bạn"} trở lại!`, { autoClose: 2000 });
      router.replace("/");
    } catch (error: any) {
      console.error("Lỗi đăng nhập:", error);
      const msg =
        error?.response?.data?.message || "Email hoặc mật khẩu không đúng. Vui lòng thử lại!";
      toast.error(msg, { autoClose: 3000 });
    }
  };

  return (
    <AuthLayout title="Đăng nhập">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email or Phone Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">
            Tài khoản NETTECH (Email/SĐT)
          </label>
          <Input
            {...register("emailOrPhone")}
            placeholder="Nhập email hoặc số điện thoại"
            className="focus-visible:ring-primary/20 h-12"
          />
          {errors.emailOrPhone && (
            <p className="text-destructive mt-1 text-xs">
              {errors.emailOrPhone.message}
            </p>
          )}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5 pt-2">
          <label className="text-sm font-bold text-gray-700">Mật khẩu</label>
          <div className="relative">
            <Input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="focus-visible:ring-primary/20 h-12 pr-10 tracking-widest"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-1 h-10 w-10 -translate-y-1/2 text-gray-500 hover:bg-transparent hover:text-gray-700"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </Button>
          </div>
          {errors.password && (
            <p className="text-destructive mt-1 text-xs">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Remember me and Forgot Password */}
        <div className="flex items-center justify-between pt-1 pb-2">
          <label className="mb-0 flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="text-primary focus:ring-primary h-4 w-4 rounded border-gray-300"
            />
            <span className="text-gray-600">Duy trì đăng nhập</span>
          </label>
          <Link
            href="/forgot-password"
            className="text-primary text-sm font-bold hover:underline"
          >
            Quên mật khẩu?
          </Link>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary hover:bg-primary-hover h-12 w-full text-[15px] font-bold text-white"
        >
          {isSubmitting ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
        </Button>

        {/* Separator */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative mt-4 mb-4 bg-white px-2 text-xs text-gray-500">
            Hoặc đăng nhập bằng
          </div>
        </div>

        {/* Social Logins */}
        <div className="flex items-center justify-center gap-4">
          <Button
            type="button"
            variant="outline"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white p-0 shadow-sm transition-colors hover:bg-gray-50"
          >
            <FcGoogle className="h-6 w-6" />
          </Button>
          <Button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-[#1877f2] p-0 text-white shadow-sm transition-colors hover:bg-[#1877f2]/90"
          >
            <FaFacebook className="h-6 w-6" />
          </Button>
          <Button
            type="button"
            className="flex h-12 w-12 items-center justify-center rounded-full border-0 bg-black p-0 text-white shadow-sm transition-colors hover:bg-gray-800"
          >
            <FaApple className="h-6 w-6" />
          </Button>
        </div>

        {/* Sign up Link */}
        <div className="pt-4 text-center text-sm font-medium text-gray-700">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="text-primary font-bold hover:underline"
          >
            Đăng ký ngay
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
