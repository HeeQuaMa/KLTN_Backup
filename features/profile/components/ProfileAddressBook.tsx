"use client";

import React, { useState, useEffect } from "react";
import { addressApi, UserAddress } from "@/features/address/api/addressApi";
import { AddressFormModal } from "@/features/address/components/AddressFormModal";
import { Button } from "@/components/ui/button";

export const ProfileAddressBook = () => {
  const [addresses, setAddresses] = useState<UserAddress[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(null);

  const fetchAddresses = async () => {
    setIsLoading(true);
    const data = await addressApi.getSavedAddresses();
    setAddresses(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa địa chỉ này?")) {
      await addressApi.deleteAddress(id);
      fetchAddresses();
    }
  };

  const handleSetDefault = async (id: string) => {
    await addressApi.setDefaultAddress(id);
    fetchAddresses();
  };

  const handleOpenAdd = () => {
    setEditingAddress(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (addr: UserAddress) => {
    setEditingAddress(addr);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (data: Omit<UserAddress, "id"> | UserAddress) => {
    setIsModalOpen(false); // Optimistic close
    if ("id" in data) {
      await addressApi.updateAddress(data as UserAddress);
    } else {
      await addressApi.saveAddress(data);
    }
    fetchAddresses();
  };

  return (
    <div className="flex w-full flex-col rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 p-5 md:p-8">
        <h1 className="text-[20px] font-bold text-heading">Địa Chỉ Của Tôi</h1>
        <Button onClick={handleOpenAdd} className="h-10 px-4 text-[14px] font-bold text-white shadow-sm">+ Thêm địa chỉ mới</Button>
      </div>

      {/* List */}
      <div className="flex flex-col p-5 md:p-8 pt-0 md:pt-0">
        {isLoading ? (
          <div className="py-10 text-center text-gray-500">Đang tải dữ liệu...</div>
        ) : addresses.length === 0 ? (
          <div className="py-10 text-center text-gray-500">Bạn chưa lưu địa chỉ nào.</div>
        ) : (
          addresses.map((addr, idx) => (
            <div key={addr.id} className={`flex flex-col gap-4 md:flex-row md:items-start md:justify-between py-6 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}>
              {/* Address Content */}
              <div className="flex flex-col gap-1.5 flex-1 pr-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[15px] font-bold text-heading border-r border-gray-300 pr-2">{addr.fullName}</span>
                  <span className="text-[14px] text-gray-500 font-medium">{"(+84) " + (addr.phone.startsWith("0") ? addr.phone.substring(1) : addr.phone)}</span>
                </div>
                <span className="text-[14px] text-gray-600 leading-snug">{addr.addressDetail}</span>
                <span className="text-[14px] text-gray-600 leading-snug">{addr.ward}, {addr.district}, {addr.city}</span>

                {addr.isDefault && (
                  <div className="mt-2 w-fit rounded-[4px] border border-destructive bg-white px-2 py-0.5 text-[12px] font-medium text-destructive">
                    Mặc định
                  </div>
                )}
              </div>

              {/* Actions Right */}
              <div className="flex flex-col md:items-end gap-3 mt-2 md:mt-0 md:w-32 shrink-0">
                <div className="flex items-center gap-3">
                  <button onClick={() => handleOpenEdit(addr)} className="text-[14px] font-medium text-primary hover:underline">
                    Cập nhật
                  </button>
                  <button onClick={() => handleDelete(addr.id)} className="text-[14px] font-medium text-destructive hover:underline">
                    Xóa
                  </button>
                </div>

                {!addr.isDefault && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleSetDefault(addr.id)} 
                    className="h-8 md:h-9 text-[13px] border-gray-200 text-gray-600 font-medium bg-white hover:bg-gray-50 px-3 w-fit md:w-full"
                  >
                    Thiết lập mặc định
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      <AddressFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleSaveModal}
        initialData={editingAddress}
      />
    </div>
  );
};
