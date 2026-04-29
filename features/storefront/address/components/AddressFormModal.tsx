"use client";

import React, { useState, useEffect } from "react";
import { UserAddress } from "@/features/storefront/address/api/addressApi";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface AddressFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (address: Omit<UserAddress, "id"> | UserAddress) => void;
  initialData?: UserAddress | null;
}

export function AddressFormModal({ isOpen, onClose, onSave, initialData }: AddressFormModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    district: "",
    ward: "",
    addressDetail: "",
    isDefault: false,
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({ ...initialData, isDefault: !!initialData.isDefault });
      } else {
        setFormData({
          fullName: "",
          phone: "",
          city: "",
          district: "",
          ward: "",
          addressDetail: "",
          isDefault: false,
        });
      }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.addressDetail || !formData.city) {
      alert("Vui lòng điền đầy đủ các trường bắt buộc.");
      return;
    }
    
    // Pass along ID if we are updating (initialData exists)
    if (initialData) {
      onSave({ ...formData, id: initialData.id } as UserAddress);
    } else {
      onSave(formData as Omit<UserAddress, "id">);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="text-lg font-bold text-gray-900">
            {initialData ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
          </h2>
          <Button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-4 space-y-4 bg-white flex-1 relative">
          <form id="address-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 mt-2">
              <label className="text-[13px] font-medium text-gray-600">Họ và tên *</label>
              <Input
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-600">Số điện thoại *</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0912345678"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-600">Tỉnh/Thành phố *</label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Thành phố Hồ Chí Minh"
              />
            </div>

            <div className="flex gap-4">
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">Quận/Huyện *</label>
                <Input
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Quận 1"
                />
              </div>
              <div className="flex flex-1 flex-col gap-1.5">
                <label className="text-[13px] font-medium text-gray-600">Phường/Xã *</label>
                <Input
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  placeholder="Phường Bến Nghé"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-gray-600">Địa chỉ cụ thể *</label>
              <Input
                value={formData.addressDetail}
                onChange={(e) => setFormData({ ...formData, addressDetail: e.target.value })}
                placeholder="Số 69/68 Đặng Thùy Trâm"
              />
            </div>

            <label className="mt-2 flex cursor-pointer items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-[14px] text-gray-700 font-medium">Lưu làm địa chỉ mặc định</span>
            </label>
          </form>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 bg-gray-50 flex gap-3 justify-end">
          <Button variant="outline" onClick={onClose} className="font-bold border-gray-200">
            Trở lại
          </Button>
          <Button type="submit" form="address-form" className="font-bold bg-primary text-white h-10 px-8">
            LƯU ĐỊA CHỈ
          </Button>
        </div>
      </div>
    </div>
  );
}
