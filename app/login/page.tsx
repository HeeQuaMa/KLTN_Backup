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

import { AuthLayout } from "@/components/layout/AuthLayout";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, LoginFormData } from "@/features/auth/utils/validation";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    // @ts-ignore
    resolver: zodResolver(loginSchema),
    defaultValues: { emailOrPhone: "", password: "" }
  });

  const onSubmit = async (data: LoginFormData) => {
    // Mock Login action
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log("Login data:", data);
    
    login(data);
    toast.success("Đăng nhập thành công!", { autoClose: 2000 });
    router.replace("/");
  };

  return (
    <AuthLayout title="Đăng nhập">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        {/* Email or Phone Input */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700">Tài khoản NETTECH (Email/SĐT)</label>
          <Input 
            {...register("emailOrPhone")}
            placeholder="Nhập email hoặc số điện thoại" 
            className="h-12 focus-visible:ring-primary/20"
          />
          {errors.emailOrPhone && <p className="text-xs text-destructive mt-1">{errors.emailOrPhone.message}</p>}
        </div>

        {/* Password Input */}
        <div className="space-y-1.5 pt-2">
          <label className="text-sm font-bold text-gray-700">Mật khẩu</label>
          <div className="relative">
            <Input 
              {...register("password")}
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••••••" 
              className="h-12 pr-10 tracking-widest focus-visible:ring-primary/20"
            />
            <Button 
              type="button" 
              variant="ghost"
              size="icon"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-10 text-gray-500 hover:text-gray-700 hover:bg-transparent"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </Button>
          </div>
          {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
        </div>

        {/* Remember me and Forgot Password */}
        <div className="flex items-center justify-between pt-1 pb-2">
          <label className="flex items-center gap-2 cursor-pointer text-sm mb-0">
            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" />
            <span className="text-gray-600">Duy trì đăng nhập</span>
          </label>
          <Link href="/forgot-password" className="text-sm font-bold text-primary hover:underline">
            Quên mật khẩu?
          </Link>
        </div>

        {/* Login Button */}
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full h-12 text-[15px] font-bold bg-primary hover:bg-primary-hover text-white"
        >
          {isSubmitting ? "ĐANG XỬ LÝ..." : "ĐĂNG NHẬP"}
        </Button>

        {/* Separator */}
        <div className="relative my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative bg-white px-2 mt-4 mb-4 text-xs text-gray-500">
            Hoặc đăng nhập bằng
          </div>
        </div>

        {/* Social Logins */}
        <div className="flex items-center justify-center gap-4">
          <Button 
            type="button" 
            variant="outline"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition-colors shadow-sm p-0"
          >
            <FcGoogle className="h-6 w-6" />
          </Button>
          <Button 
            type="button" 
            className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1877f2] text-white hover:bg-[#1877f2]/90 transition-colors shadow-sm p-0 border-0"
          >
            <FaFacebook className="h-6 w-6" />
          </Button>
          <Button 
            type="button" 
            className="flex h-12 w-12 items-center justify-center rounded-full bg-black text-white hover:bg-gray-800 transition-colors shadow-sm p-0 border-0"
          >
            <FaApple className="h-6 w-6" />
          </Button>
        </div>

        {/* Sign up Link */}
        <div className="text-center pt-4 text-sm font-medium text-gray-700">
          Chưa có tài khoản?{" "}
          <Link href="/register" className="font-bold text-primary hover:underline">
            Đăng ký ngay
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
