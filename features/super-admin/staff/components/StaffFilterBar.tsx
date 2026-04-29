import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, Plus } from "lucide-react";

export function StaffFilterBar() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      
      {/* Left side: Search & Dropdowns */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 flex-1">
        {/* Search */}
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm theo Tên, Email, Mã NV..."
            className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Filters Group */}
        <div className="flex items-center gap-3 overflow-x-auto w-full">
          {/* Dropdown Vai trò */}
          <div className="relative min-w-[140px]">
            <select className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none">
              <option>Vai trò: Tất cả</option>
              <option>Store Manager</option>
              <option>Sales Staff</option>
              <option>Warehouse Staff</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>

          {/* Dropdown Chi nhánh */}
          <div className="relative min-w-[160px]">
            <select className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none">
              <option>Chi nhánh: Tất cả</option>
              <option>Quận 1 - HCM</option>
              <option>Quận 5 - HCM</option>
              <option>Gò Vấp</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>

          {/* Dropdown Trạng thái */}
          <div className="relative min-w-[140px]">
            <select className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none">
              <option>Trạng thái: Active</option>
              <option>Trạng thái: Inactive</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>
      </div>

      {/* Right side: Add button */}
      <div>
        <Button className="flex w-full items-center justify-center md:w-auto gap-2 rounded-md bg-blue-700 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 transition-colors uppercase">
          <Plus className="h-4 w-4" />
          Thêm Nhân viên
        </Button>
      </div>

    </div>
  );
}
