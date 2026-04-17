import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { WarrantyData } from "../types/warranty";

export const WarrantyItem = ({ item }: { item: WarrantyData }) => {
  const statusConfig = {
    repairing: {
      label: "Đang sửa chữa",
      className: "bg-[#FFF8E1] text-[#F57F17]",
    },
    active: {
      label: "Còn hiệu lực",
      className: "bg-success/15 text-success",
    },
    expired: {
      label: "Hết hạn",
      className: "bg-gray-100 text-gray-500",
    },
  };

  const currentStatus = statusConfig[item.status];

  return (
    <div className="flex flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex gap-4">
        {/* Image placeholder */}
        <div className="h-[90px] w-[90px] shrink-0 overflow-hidden rounded-md bg-gray-100 border border-gray-100 relative">
          {item.imageUrl ? (
            <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" />
          ) : null}
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col justify-between md:flex-row">
          
          <div className="flex flex-col gap-1 pr-4">
            <span className="text-[16px] font-bold text-heading">{item.productName}</span>
            <span className="text-[13px] text-gray-500 mt-1 font-medium">Serial/IMEI: {item.serial}</span>
            <span className={`text-[13px] font-bold mt-0.5 ${item.status === 'active' ? 'text-success' : 'text-primary'}`}>
              {item.statusDetail}
            </span>
          </div>

          <div className="mt-4 flex flex-col items-start justify-between gap-3 md:mt-0 md:items-end">
            <div className={`flex w-fit items-center justify-center rounded-md px-3 py-1 text-[13px] font-bold ${currentStatus.className}`}>
              {currentStatus.label}
            </div>

            {item.hasProgressView ? (
              <Button className="h-9 px-6 font-bold text-white shadow-sm w-full md:w-auto">
                XEM TIẾN ĐỘ
              </Button>
            ) : (
              <Button variant="outline" className="h-9 px-6 border-primary text-primary hover:bg-blue-50 bg-white font-bold w-full md:w-auto">
                YÊU CẦU BẢO HÀNH
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
