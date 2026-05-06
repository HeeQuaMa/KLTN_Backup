"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Eye, EyeOff } from "lucide-react";

interface LoginForm {
  email?: string;
  password?: string;
}

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3001/auth/login", data);
      
      console.log("DỮ LIỆU BACKEND TRẢ VỀ:", res.data);

      // TRƯỜNG HỢP 1: Dùng access_token
      const { access_token, user } = res.data;

      if (user?.role === "CUSTOMER" || user?.role === "Customer") {
        alert("CẢNH BÁO: Tài khoản này không có quyền truy cập hệ thống quản trị!");
        return;
      }

      // Lưu key là admin_token, value là access_token
      if (access_token) {
        localStorage.setItem("admin_token", access_token);
        localStorage.setItem("admin_info", JSON.stringify(user));
      } else {
        console.error("Không tìm thấy Token trong response!");
        alert("Lỗi hệ thống: Không lấy được thẻ truy cập.");
        return;
      }

      alert("Đăng nhập thành công!");
      router.push("/super-admin");
      
    } catch (error) {
      console.error("Lỗi đăng nhập:", error);
      alert("Email hoặc mật khẩu không chính xác. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-900 px-4 sm:px-6">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-1/4 -top-1/2 h-[1000px] w-[1000px] rounded-full bg-blue-600/20 blur-[120px]" />
        <div className="absolute -bottom-1/2 -left-1/4 h-[800px] w-[800px] rounded-full bg-indigo-600/20 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-[440px] rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="mb-10 text-center">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-inner">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check">
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2-1 4-2 7-2 2.5 0 4.5 1 6 2a1 1 0 0 1 1 1v7z"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            NET<span className="text-blue-600">TECH</span>
          </h1>
          <p className="mt-2 text-sm font-bold uppercase tracking-widest text-slate-400">
            Internal Portal
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Tài khoản nội bộ (Email)</label>
            <Input 
              placeholder="admin@nettech.vn" 
              className="h-12 border-slate-200 bg-slate-50 text-base transition-colors focus:bg-white focus:ring-2 focus:ring-blue-600/20"
              {...register("email", { required: "Vui lòng nhập email" })} 
            />
            {errors.email && <span className="text-xs font-medium text-red-500">{errors.email?.message as string}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-700">Mật khẩu</label>
              <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline">Quên mật khẩu?</a>
            </div>
            <div className="relative">
              <Input 
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                className="h-12 border-slate-200 bg-slate-50 text-base transition-colors focus:bg-white focus:ring-2 focus:ring-blue-600/20"
                {...register("password", { required: "Vui lòng nhập mật khẩu" })} 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && <span className="text-xs font-medium text-red-500">{errors.password?.message as string}</span>}
          </div>

          <div className="flex items-center gap-2 pb-2">
            <input type="checkbox" id="remember" className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="remember" className="cursor-pointer text-sm font-medium text-slate-600">
              Duy trì đăng nhập
            </label>
          </div>

          <Button 
            type="submit" 
            disabled={loading} 
            className="h-12 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-base font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:from-blue-700 hover:to-blue-800 hover:shadow-blue-600/40"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "ĐĂNG NHẬP HỆ THỐNG"}
          </Button>
        </form>
      </div>
    </div>
  );
}