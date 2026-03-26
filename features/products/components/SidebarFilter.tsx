"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

const SidebarFilter = () => {
  const [activePrice, setActivePrice] = useState("25 - 40 triệu");
  const [activeBrand, setActiveBrand] = useState("DELL");

  const prices = [
    "Dưới 15 triệu",
    "15 - 25 triệu",
    "25 - 40 triệu",
    "Trên 40 triệu",
  ];
  const brands = ["ASUS", "DELL", "MSI", "APPLE"];
  const cpus = ["Core i5 / Ryzen 5", "Core i7 / Ryzen 7", "Core i9 / Ryzen 9"];
  const rams = ["8GB", "16GB", "32GB"];

  return (
    <div className="flex w-full shrink-0 flex-col gap-8 pr-6 lg:w-64">
      {/* KHOẢNG GIÁ */}
      <div>
        <h3 className="mb-4 text-[20px] font-bold tracking-wide text-gray-900 uppercase">
          Khoảng giá
        </h3>
        <div className="flex flex-col gap-3">
          {prices.map((price) => (
            <label
              key={price}
              className="group flex cursor-pointer flex-row items-center gap-3"
            >
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-lg border",
                  activePrice === price
                    ? "bg-primary border-primary"
                    : "border-gray-300 bg-white group-hover:border-primary/50",
                )}
                onClick={() => setActivePrice(price)}
              />
              <span
                className={cn(
                  "text-base select-none",
                  activePrice === price
                    ? "text-primary font-bold"
                    : "text-gray-600 group-hover:text-gray-900",
                )}
                onClick={() => setActivePrice(price)}
              >
                {price}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      {/* THƯƠNG HIỆU */}
      <div>
        <h3 className="mb-4 text-[20px] font-bold tracking-wide text-gray-900 uppercase">
          Thương hiệu
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={cn(
                "h-10 w-full rounded-md border py-2 text-base font-bold uppercase transition-all",
                activeBrand === brand
                  ? "border-primary text-primary bg-foreground/5"
                  : "hover:text-secondary-text1 border-gray-200 bg-white text-gray-600 hover:border-gray-300",
              )}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      {/* CPU */}
      <div>
        <h3 className="mb-4 text-[20px] font-bold tracking-wide text-gray-900 uppercase">
          CPU
        </h3>
        <div className="flex flex-col gap-3">
          {cpus.map((cpu) => (
            <label
              key={cpu}
              className="group flex cursor-pointer flex-row items-center gap-3"
            >
              <div className="flex h-5 w-5 items-center justify-center rounded-lg border border-gray-300 bg-white group-hover:border-primary/50" />
              <span className="text-base text-gray-600 select-none group-hover:text-gray-900">
                {cpu}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      {/* RAM */}
      <div>
        <h3 className="mb-4 text-[20px] font-bold tracking-wide text-gray-900 uppercase">
          RAM
        </h3>
        <div className="flex flex-wrap gap-2">
          {rams.map((ram) => (
            <button
              key={ram}
              className="rounded-md border border-gray-200 bg-white px-4 py-2 text-base font-bold text-gray-600 uppercase transition-all hover:border-gray-300 hover:text-gray-900"
            >
              {ram}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
