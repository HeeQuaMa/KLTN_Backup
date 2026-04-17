"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const ChangePasswordForm = () => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      setError("Vui lòng điền đầy đủ các trường.");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("Mật khẩu mới phải có ít nhất 6 ký tự.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    // Tiền xử lý thành công mô phỏng API
    setTimeout(() => {
      setSuccess(true);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 500);
  };

  return (
    <div className="flex w-full flex-col rounded-xl border border-gray-100 bg-white shadow-sm pb-10">
      {/* Header */}
      <div className="flex flex-col gap-1.5 border-b border-gray-100 p-5 md:p-8">
        <h1 className="text-[20px] font-bold text-heading">Đổi Mật Khẩu</h1>
        <p className="text-[14px] text-gray-500">
          Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác.
        </p>
      </div>

      {/* Form Body */}
      <div className="px-5 pt-8 md:px-8 lg:px-12">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          {/* Current Password */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
            <label className="text-[14px] font-medium text-gray-600 md:w-[150px] shrink-0 text-left md:text-right">
              Mật khẩu hiện tại
            </label>
            <div className="flex-1 w-full max-w-[400px]">
              <Input
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              />
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
            <label className="text-[14px] font-medium text-gray-600 md:w-[150px] shrink-0 text-left md:text-right">
              Mật khẩu mới
            </label>
            <div className="flex-1 w-full max-w-[400px]">
              <Input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8">
            <label className="text-[14px] font-medium text-gray-600 md:w-[150px] shrink-0 text-left md:text-right mt-2 md:mt-3">
              Xác nhận mật khẩu
            </label>
            <div className="flex-1 flex flex-col gap-2 w-full max-w-[400px]">
              <Input
                type="password"
                placeholder="Nhập lại mật khẩu mới"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <Button type="button" className="text-left text-[13px] font-medium text-primary hover:underline w-fit">
                Quên mật khẩu?
              </Button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-8">
            <div className="hidden md:block md:w-[150px] shrink-0 border border-transparent"></div>
            <div className="flex-1 max-w-[400px]">
              {error && <p className="text-sm text-destructive font-medium">{error}</p>}
              {success && <p className="text-sm text-success font-medium">Đổi mật khẩu thành công!</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="flex flex-col md:flex-row gap-2 md:gap-8 mt-2">
            <div className="hidden md:block md:w-[150px] shrink-0"></div>
            <div className="flex-1">
              <Button type="submit" className="h-[42px] px-8 font-bold text-white uppercase sm:w-auto w-full">
                Xác nhận
              </Button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
