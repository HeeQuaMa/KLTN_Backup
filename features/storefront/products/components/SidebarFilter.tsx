"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import http from "@/lib/axiosInstance";
import { type ProductQueryParams } from "@/lib/api/productApi";

interface Category {
  _id: string;
  name: string;
  slug?: string;
}

interface SidebarFilterProps {
  onFilterChange?: (filters: Partial<ProductQueryParams>) => void;
  categorySlug?: string; // THÊM DÒNG NÀY: Để nhận slug từ trang category
}

const PRICE_MAP: Record<string, { minPrice?: number; maxPrice?: number }> = {
  "Dưới 5 triệu":    { maxPrice: 5_000_000 },
  "5 - 15 triệu":    { minPrice: 5_000_000,  maxPrice: 15_000_000 },
  "15 - 40 triệu":   { minPrice: 15_000_000, maxPrice: 40_000_000 },
  "Trên 40 triệu":   { minPrice: 40_000_000 },
};

const BRANDS = ["Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Corsair", "Samsung", "Dell", "Lenovo"];

const SidebarFilter = ({ onFilterChange, categorySlug }: SidebarFilterProps) => {
  const [activePrice, setActivePrice] = useState("");
  const [activeBrand, setActiveBrand] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);

  // 1. Lấy danh mục từ API
  useEffect(() => {
    http
      .get<Category[]>("/categories")
      .then((res) => {
        const fetchedCategories = res.data ?? [];
        setCategories(fetchedCategories);

        // 2. TỰ ĐỘNG ACTIVE: Nếu có categorySlug từ URL, tìm ID tương ứng để highlight
        if (categorySlug) {
          const currentCat = fetchedCategories.find(c => c.slug === categorySlug);
          if (currentCat) {
            setActiveCategory(currentCat._id);
          }
        }
      })
      .catch(() => setCategories([]));
  }, [categorySlug]); // Re-run nếu slug thay đổi

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
    <div className="flex w-full shrink-0 flex-col gap-8 pr-4 md:pr-6 lg:w-64">
      {/* ── KHOẢNG GIÁ ── */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[18px] font-bold tracking-wide uppercase text-gray-900">Khoảng giá</h3>
        <div className="flex flex-col gap-3">
          {Object.keys(PRICE_MAP).map((price) => {
            const isActive = activePrice === price;
            return (
              <label key={price} className="group flex cursor-pointer flex-row items-center gap-3" onClick={() => handlePriceChange(price)}>
                <div className={cn(
                  "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                  isActive ? "bg-primary border-primary" : "border-gray-300 bg-background group-hover:border-primary/50"
                )}>
                  {isActive && <Check size={14} strokeWidth={3} className="text-white" />}
                </div>
                <span className={cn("text-[15px] transition-colors select-none", isActive ? "text-primary font-bold" : "text-gray-600 group-hover:text-gray-900")}>
                  {price}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div className="h-px w-full bg-border" />

      {/* ── THƯƠNG HIỆU ── */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[18px] font-bold tracking-wide uppercase text-gray-900">Thương hiệu</h3>
        <div className="grid grid-cols-2 gap-3">
          {BRANDS.map((brand) => {
            const isActive = activeBrand === brand;
            return (
              <Button
                variant="outline"
                key={brand}
                onClick={() => handleBrandChange(brand)}
                className={cn(
                  "flex h-11 w-full items-center justify-center rounded-md border text-[14px] font-bold tracking-wider uppercase transition-all shadow-none relative",
                  isActive ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground"
                )}
              >
                {brand}
                {isActive && <span className="absolute right-2 opacity-40"><Check size={14} /></span>}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="h-px w-full bg-border" />

      {/* ── DANH MỤC ── */}
      {categories.length > 0 && (
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase text-gray-900">Danh mục</h3>
          <div className="flex flex-col gap-2">
            {categories.map((cat) => (
              <Button
                variant="ghost"
                key={cat._id}
                onClick={() => handleCategoryChange(cat._id)}
                className={cn(
                  "w-full justify-start px-3 py-6 text-left text-[15px] font-medium transition-all border",
                  activeCategory === cat._id
                    ? "border-primary bg-primary/5 text-primary font-bold"
                    : "border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                {cat.name}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarFilter;