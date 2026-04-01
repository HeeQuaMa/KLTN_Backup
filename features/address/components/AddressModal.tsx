import React, { useState, useEffect } from "react";
import { UserAddress } from "@/features/address/api/addressApi";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  addresses: UserAddress[];
  onSelect: (address: UserAddress) => void;
  selectedId?: string;
}

export function AddressModal({ isOpen, onClose, addresses, onSelect, selectedId }: AddressModalProps) {
  const [tempSelectedId, setTempSelectedId] = useState<string | undefined>(selectedId);

  useEffect(() => {
    if (isOpen) {
      setTempSelectedId(selectedId || (addresses.length > 0 ? addresses[0].id : undefined));
    }
  }, [isOpen, selectedId, addresses]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-4">
          <h2 className="text-lg font-bold text-gray-900">Chọn địa chỉ nhận hàng</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* List Body */}
        <div className="overflow-y-auto p-4 space-y-4 bg-white flex-1 min-h-[50vh]">
          {addresses.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Bạn chưa có địa chỉ lưu nào.</p>
          ) : (
            addresses.map((addr) => {
              const isSelected = tempSelectedId === addr.id;
              
              return (
                <div 
                  key={addr.id} 
                  onClick={() => setTempSelectedId(addr.id)}
                  className={`relative cursor-pointer rounded-lg border p-4 transition-all ${
                    isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Radio Button Custom */}
                    <div className="mt-1 flex-shrink-0">
                      <div className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        isSelected ? "border-primary" : "border-gray-300"
                      }`}>
                         {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                    
                    {/* Address Content */}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center flex-wrap gap-2 text-[15px]">
                        <span className="font-bold text-gray-900">{addr.fullName}</span>
                        <span className="text-gray-400">|</span>
                        <span className="text-gray-500">{addr.phone}</span>
                      </div>
                      <p className="text-sm text-gray-600 leading-snug">{addr.addressDetail}</p>
                      <p className="text-sm text-gray-600 leading-snug">{addr.ward}, {addr.district}, {addr.city}</p>
                      
                      {addr.isDefault && (
                        <div className="mt-2 inline-block">
                          <span className="rounded border border-red-500 px-[6px] py-[2px] text-[10px] font-bold text-red-500 bg-red-500/5">
                            Mặc định
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4 bg-white flex justify-end">
          <Button 
            onClick={() => {
              const selectedAddr = addresses.find(a => a.id === tempSelectedId);
              if (selectedAddr) {
                onSelect(selectedAddr);
              }
            }}
            disabled={!tempSelectedId}
            className="w-full sm:w-auto bg-primary text-white font-bold h-[42px] px-10 rounded text-sm hover:opacity-90 transition-opacity"
          >
            XÁC NHẬN
          </Button>
        </div>
      </div>
    </div>
  );
}
