"use client";

import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function MemberFilterBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // State cục bộ cho ô search để gõ không bị giật
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");

  // Hàm cập nhật URL
  const updateQuery = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "all") {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1"); // Đổi filter thì reset về trang 1
    router.push(`${pathname}?${params.toString()}`);
  };

  // Debounce search (ngừng gõ 500ms mới gọi API)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTerm !== (searchParams.get("search") || "")) {
        updateQuery("search", searchTerm);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm theo tên, SĐT, Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Dropdown Trạng thái (THÊM MỚI VÀO ĐÂY) */}
        <div className="relative w-full md:w-auto">
          <select 
            onChange={(e) => updateQuery("status", e.target.value)}
            defaultValue={searchParams.get("status") || "ACTIVE"}
            className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="ACTIVE">Trạng thái: Hoạt động</option>
            <option value="LOCKED">Trạng thái: Đã khóa</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>

        {/* Dropdown */}
        <div className="relative w-full md:w-auto">
          <select 
            onChange={(e) => updateQuery("tier", e.target.value)}
            defaultValue={searchParams.get("tier") || "all"}
            className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
          >
            <option value="all">Hạng thẻ: Tất cả</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
            <option value="Member">Member</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      <div>
        <Link 
          href="/super-admin/members/create"
          className="flex w-full items-center justify-center md:w-auto gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Thêm mới
        </Link>
      </div>
    </div>
  );
}