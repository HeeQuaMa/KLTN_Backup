"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const ProfileForm = () => {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);

  // Form state to match Figma exactly
  const [formData, setFormData] = useState<{
    name: string;
    phone: string;
    email: string;
    gender: "Nam" | "Nữ";
  }>({
    name: "",
    phone: "",
    email: "",
    gender: "Nam",
  });

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        email: user.email || "",
        gender: user.gender || "Nam",
      });
    }
    setMounted(true);
  }, [user]);

  if (!mounted || !user) return null;

  const handleSave = () => {
    // Save to Zustand store
    updateUser(formData);
    alert("Cập nhật thông tin thành công!");
  };

  return (
    <div className="flex w-full flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm md:p-8">
      {/* Header */}
      <div className="mb-8 flex flex-col gap-1">
        <h1 className="text-[20px] font-bold text-heading">Hồ Sơ Của Tôi</h1>
        <p className="text-[14px] text-muted-foreground">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </p>
      </div>

      {/* Form Fields */}
      <div className="flex w-full max-w-xl flex-col gap-6">
        
        {/* Full Name */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <label className="w-32 text-[14px] font-medium text-gray-600">
            Họ và tên
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="flex-1 h-10 w-full md:w-auto"
          />
          <div className="hidden w-[60px] md:block" />{/* Spacer for alignment with phone row */}
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <label className="w-32 text-[14px] font-medium text-gray-600">
            Số điện thoại
          </label>
          <Input
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="flex-1 h-10 w-full md:w-auto"
            readOnly
          />
          <Button className="w-[60px] text-left text-[13px] font-medium text-primary hover:underline md:ml-4">
            Thay đổi
          </Button>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center">
          <label className="w-32 text-[14px] font-medium text-gray-600">
            Email
          </label>
          <Input
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="flex-1 h-10 w-full md:w-auto"
          />
          <div className="hidden w-[60px] md:block" />
        </div>

        {/* Gender */}
        <div className="flex flex-col gap-2 md:flex-row md:items-center pt-2">
          <label className="w-32 text-[14px] font-medium text-gray-600">
            Giới tính
          </label>
          <div className="flex flex-1 items-center gap-6">
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="Nam"
                checked={formData.gender === "Nam"}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Nam" | "Nữ" })}
                className="h-4 w-4 cursor-pointer text-primary focus:ring-primary"
              />
              <span className="text-[14px] text-gray-700">Nam</span>
            </label>
            <label className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="gender"
                value="Nữ"
                checked={formData.gender === "Nữ"}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as "Nam" | "Nữ" })}
                className="h-4 w-4 cursor-pointer text-primary focus:ring-primary"
              />
              <span className="text-[14px] text-gray-700">Nữ</span>
            </label>
          </div>
          <div className="hidden w-[60px] md:block" />
        </div>

        {/* Save Button */}
        <div className="mt-4 flex md:pl-32">
          <Button
            onClick={handleSave}
            className="h-10 w-[120px] rounded-md text-[14px] font-bold text-white shadow-sm"
          >
            LƯU
          </Button>
        </div>
      </div>
    </div>
  );
};
