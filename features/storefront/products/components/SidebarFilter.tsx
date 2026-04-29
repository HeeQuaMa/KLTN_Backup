"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { type ProductQueryParams } from "@/lib/api/productApi";
import http from "@/lib/axios";

interface Category {
  _id: string;
  name: string;
  slug?: string;
}

interface SidebarFilterProps {
  onFilterChange?: (filters: Partial<ProductQueryParams>) => void;
}

/** Map nhãn khoảng giá → { minPrice, maxPrice } */
const PRICE_MAP: Record<string, { minPrice?: number; maxPrice?: number }> = {
  "Dưới 5 triệu":    { maxPrice: 5_000_000 },
  "5 - 15 triệu":    { minPrice: 5_000_000,  maxPrice: 15_000_000 },
  "15 - 40 triệu":   { minPrice: 15_000_000, maxPrice: 40_000_000 },
  "Trên 40 triệu":   { minPrice: 40_000_000 },
};

/** Thương hiệu trong seed data của dự án */
const BRANDS = ["Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Corsair", "Samsung", "be quiet!"];

const SidebarFilter = ({ onFilterChange }: SidebarFilterProps) => {
  const [activePrice,    setActivePrice]    = useState("");
  const [activeBrand,    setActiveBrand]    = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [categories,     setCategories]     = useState<Category[]>([]);

  // Lấy danh mục từ API để filter dùng đúng _id từ database
  useEffect(() => {
    http
      .get<Category[]>("/categories")
      .then((res) => setCategories(res.data ?? []))
      .catch(() => setCategories([]));
  }, []);

  const handlePriceChange = (price: string) => {
    const next = price === activePrice ? "" : price;
    setActivePrice(next);
    const priceFilter = next
      ? PRICE_MAP[next]
      : { minPrice: undefined, maxPrice: undefined };
    onFilterChange?.({ ...priceFilter });
  };

  const handleBrandChange = (brand: string) => {
    const next = brand === activeBrand ? "" : brand;
    setActiveBrand(next);
    onFilterChange?.({ brand: next || undefined });
  };

  const handleCategoryChange = (catId: string) => {
    const next = catId === activeCategory ? "" : catId;
    setActiveCategory(next);
    onFilterChange?.({ category: next || undefined });
  };

  return (
    <div className="flex w-full shrink-0 flex-col gap-8 pr-6 lg:w-64">

      {/* ── KHOẢNG GIÁ ── */}
      <div>
        <h3 className="mb-4 text-[20px] font-bold tracking-wide text-gray-900 uppercase">
          Khoảng giá
        </h3>
        <div className="flex flex-col gap-3">
          {Object.keys(PRICE_MAP).map((price) => (
            <label key={price} className="group flex cursor-pointer flex-row items-center gap-3">
              <div
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-lg border",
                  activePrice === price
                    ? "bg-primary border-primary"
                    : "border-gray-300 bg-white group-hover:border-primary/50",
                )}
                onClick={() => handlePriceChange(price)}
              />
              <span
                className={cn(
                  "text-base select-none",
                  activePrice === price
                    ? "text-primary font-bold"
                    : "text-gray-600 group-hover:text-gray-900",
                )}
                onClick={() => handlePriceChange(price)}
              >
                {price}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="h-px w-full bg-gray-200" />

      {/* ── DANH MỤC (dynamic từ DB) ── */}
      {categories.length > 0 && (
        <>
          <div>
            <h3 className="mb-4 text-[20px] font-bold tracking-wide text-gray-900 uppercase">
              Danh mục
            </h3>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => (
                <button
                  key={cat._id}
                  onClick={() => handleCategoryChange(cat._id)}
                  className={cn(
                    "w-full rounded-md border px-3 py-2 text-left text-sm font-medium transition-all",
                    activeCategory === cat._id
                      ? "border-primary bg-primary/5 text-primary font-bold"
                      : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900",
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
          <div className="h-px w-full bg-gray-200" />
        </>
      )}

      {/* ── THƯƠNG HIỆU ── */}
      <div>
        <h3 className="mb-4 text-[20px] font-bold tracking-wide text-gray-900 uppercase">
          Thương hiệu
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {BRANDS.map((brand) => (
            <button
              key={brand}
              onClick={() => handleBrandChange(brand)}
              className={cn(
                "h-10 w-full rounded-md border py-2 text-sm font-bold uppercase transition-all",
                activeBrand === brand
                  ? "border-primary text-primary bg-primary/5"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900",
              )}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default SidebarFilter;
