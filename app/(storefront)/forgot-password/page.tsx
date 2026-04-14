"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

import { AuthLayout } from "@/components/layout/AuthLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  forgotPasswordSchema,
  ForgotPasswordFormData,
} from "@/features/auth/utils/validation";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    // @ts-ignore
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    console.log("Send reset email to:", data.email);
    toast.success("Mã xác minh đã được gửi đến email của bạn!", {
      autoClose: 3000,
    });
    reset(); // Optionally redirect to login or show success UI instead
  };

  return (
    <AuthLayout title="Quên mật khẩu?">
      <div className="mb-6 text-center">
        <p className="mx-auto max-w-75 text-xs text-gray-500">
          Nhập địa chỉ email được liên kết với tài khoản NETTECH của bạn. Chúng
          tôi sẽ gửi mã xác minh để đặt lại mật khẩu.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center space-y-4"
      >
        {/* Email Input */}
        <div className="w-full max-w-[320px] space-y-1">
          <label className="text-xs font-bold text-gray-900">Email</label>
          <Input
            {...register("email")}
            placeholder="Nettech@gmail.com"
            className="focus-visible:ring-primary/20 h-10 text-sm"
          />
          {errors.email && (
            <p className="text-destructive mt-1 text-[11px]">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 h-10 w-full max-w-[320px] bg-primary text-xs font-bold text-white hover:bg-primary-hover"
        >
          {isSubmitting ? "ĐANG XỬ LÝ..." : "GỬI MÃ XÁC MINH"}
        </Button>

        {/* Back Link */}
        <div className="mt-6 pt-4">
          <Link
            href="/login"
            className="flex items-center text-xs font-bold text-primary hover:underline"
          >
            <ArrowLeft className="mr-1 h-3 w-3" /> Quay lại Đăng nhập
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}
