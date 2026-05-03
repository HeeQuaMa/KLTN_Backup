"use client";

import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function ProductFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // 1. Quản lý trạng thái search cục bộ để gõ cho mượt (không bị lag khi fetch data)
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // 2. Hàm cập nhật URL Params (Trái tim của phần lọc)
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Luôn reset về trang 1 khi thực hiện lọc/tìm kiếm mới
    params.set("page", "1"); 
    
    router.push(`${pathname}?${params.toString()}`);
  };

  // 3. Logic DEBOUNCE: Đợi người dùng ngừng gõ 500ms mới cập nhật URL
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Chỉ cập nhật nếu giá trị search thực sự thay đổi so với URL hiện tại
      if (searchTerm !== (searchParams.get("search") || "")) {
        updateQuery("search", searchTerm);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm md:flex-row md:items-center">
      {/* Ô tìm kiếm */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          type="text"
          placeholder="Tìm theo tên, SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm text-slate-800 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>
      
      {/* Bộ lọc Dropdown */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {/* Lọc danh mục */}
        <div className="relative">
          <select 
            onChange={(e) => updateQuery("category", e.target.value)}
            defaultValue={searchParams.get("category") || ""}
            className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none sm:w-auto"
          >
            <option value="">Danh mục: Tất cả</option>
            <option value="cpu">Vi xử lý (CPU)</option>
            <option value="mainboard">Mainboard</option>
            <option value="laptop">Laptop</option>
            <option value="vga">Card đồ họa (VGA)</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-slate-500" />
        </div>

        {/* Lọc thương hiệu */}
        <div className="relative">
          <select 
             onChange={(e) => updateQuery("brand", e.target.value)}
             defaultValue={searchParams.get("brand") || ""}
             className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none sm:w-auto"
          >
            <option value="">Thương hiệu</option>
            <option value="intel">Intel</option>
            <option value="asus">Asus</option>
            <option value="dell">Dell</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-slate-500" />
        </div>

        {/* Lọc trạng thái */}
        <div className="relative">
          <select 
            onChange={(e) => updateQuery("isActive", e.target.value)}
            defaultValue={searchParams.get("isActive") || "all"}
            className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm text-slate-700 focus:border-blue-500 focus:outline-none sm:w-auto"
          >
            <option value="all">Trạng thái: Tất cả</option>
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 pointer-events-none text-slate-500" />
        </div>
      </div>
    </div>
  );
}