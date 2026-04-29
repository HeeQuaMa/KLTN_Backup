import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Plus } from "lucide-react";
import Link from "next/link";

export function MemberFilterBar() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      
      {/* Left side: Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm theo tên, SĐT, Email..."
            className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Dropdown */}
        <div className="relative w-full md:w-auto">
          <select className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none">
            <option>Hạng thẻ: Tất cả</option>
            <option>Gold</option>
            <option>Silver</option>
            <option>Member</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

      {/* Right side: Add button */}
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
