"use client";

import React from "react";
import { BuildPartItem } from "./BuildPartItem";
import { mockProducts } from "@/features/storefront/products/utils/mockData";

export const BuildPartList = () => {
  // Hardcoded mock state as requested to match UI
  // Real implementation would use Zustand or URL states

  const mockCPU = mockProducts.find((p) => p.id === "cpu-3"); // Intel Core i7-13700K
  const mockMainboard = {
    id: "main-custom",
    name: "Asus TUF Gaming Z790-Plus",
    specs: "Chipset Z790 | DDR5 | WiFi 6",
    price: 7200000,
    inStock: true,
  };
  const mockRAM = {
    id: "ram-custom",
    name: "Corsair Vengeance RGB 32GB (2x16)",
    specs: "DDR5 | 6000MHz | Black",
    price: 3500000,
    inStock: true,
  };

  const partsConfig = [
    {
      key: "cpu",
      label: "CPU",
      empty: "Vui lòng chọn CPU",
      btn: "CHỌN CPU",
      data: mockCPU,
    },
    {
      key: "main",
      label: "Mainboard",
      empty: "Vui lòng chọn Bo mạch chủ",
      btn: "CHỌN MAINBOARD",
      data: mockMainboard,
    },
    {
      key: "ram",
      label: "RAM",
      empty: "Vui lòng chọn RAM",
      btn: "CHỌN RAM",
      data: mockRAM,
    },
    {
      key: "vga",
      label: "VGA",
      empty: "Vui lòng chọn Card màn hình",
      btn: "CHỌN VGA",
      data: undefined,
    },
    {
      key: "ssd",
      label: "SSD",
      empty: "Vui lòng chọn Ổ cứng",
      btn: "CHỌN SSD",
      data: undefined,
    },
    {
      key: "psu",
      label: "PSU",
      empty: "Vui lòng chọn Nguồn máy tính",
      btn: "CHỌN PSU",
      data: undefined,
    },
    {
      key: "case",
      label: "Case",
      empty: "Vui lòng chọn Vỏ máy",
      btn: "CHỌN CASE",
      data: undefined,
    },
  ];

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Table Header (Desktop Only) */}
      <div className="hidden h-10.5 w-full items-center justify-between rounded-md bg-heading px-4 shadow-sm md:flex">
        <div className="w-32 shrink-0 text-center text-[13px] font-bold text-white">
          Linh kiện
        </div>
        <div className="flex-1 px-4 text-[13px] font-bold text-white">
          Thông tin sản phẩm
        </div>
        <div className="w-32 shrink-0 pl-16 text-center text-[13px] font-bold text-white">
          Giá thành
        </div>
        <div className="w-16 shrink-0" /> {/* Spacer for Action Buttons */}
      </div>

      {/* Part Items List */}
      <div className="flex flex-col gap-4">
        {partsConfig.map((part) => (
          <BuildPartItem
            key={part.key}
            categoryKey={part.key}
            categoryLabel={part.label}
            emptyLabel={part.empty}
            buttonString={part.btn}
            filledData={
              part.data
                ? {
                    id: part.data.id,
                    name: part.data.name,
                    specs: part.data.specs,
                    price: part.data.price,
                    image: (part.data as any).image,
                    inStock: (part.data as any).inStock !== false, // Default true
                  }
                : undefined
            }
          />
        ))}
      </div>
    </div>
  );
};
