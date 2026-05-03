"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { StaffAddModal } from "./StaffAddModal";

interface StaffFilterBarProps {
  onOpenAdd: () => void; // Khai báo là sẽ nhận một hàm
}

export function StaffFilterBar({ onOpenAdd }: StaffFilterBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // STATE ĐỂ QUẢN LÝ ĐÓNG/MỞ MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Khởi tạo state từ URL hiện tại
  const [keyword, setKeyword] = useState(searchParams.get("keyword") || "");
  const [role, setRole] = useState(searchParams.get("role") || "");
  const [branch, setBranch] = useState(searchParams.get("branchId") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");

  // Hàm update URL
  const applyFilters = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());
    
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    router.push(`?${params.toString()}`);
  };

  return (
    <>
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      
      {/* Left side: Search & Dropdowns */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm theo Tên, Email..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters({ keyword })}
            className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 overflow-x-auto w-full">
          {/* Dropdown Vai trò */}
          <div className="relative min-w-[140px]">
            <select 
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                applyFilters({ role: e.target.value });
              }}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">Vai trò: Tất cả</option>
              <option value="Super Admin">Super Admin</option>
              <option value="Store Manager">Store Manager</option>
              <option value="Sales & Support">Sales & Support</option>
              <option value="Warehouse Staff">Warehouse Staff</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>

          {/* Dropdown Trạng thái */}
          <div className="relative min-w-[140px]">
            <select 
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                applyFilters({ status: e.target.value });
              }}
              className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
            >
              <option value="all">Trạng thái: Tất cả</option>
              <option value="ACTIVE">Active (Hoạt động)</option>
              <option value="LOCKED">Locked (Đã khóa)</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Right side: Add button */}
      <div>
        <Button onClick={() => setIsModalOpen(true)} className="flex w-full items-center justify-center md:w-auto gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors uppercase">
          <Plus className="h-4 w-4" />
          Thêm Nhân viên
        </Button>
      </div>

    </div>
    <StaffAddModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </>
  );
}