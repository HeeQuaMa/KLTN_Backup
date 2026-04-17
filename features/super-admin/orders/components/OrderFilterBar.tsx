import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";

export function OrderFilterBar() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
      
      {/* Left side: Search & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Tìm Mã đơn, SĐT khách..."
            className="w-full rounded-md border border-slate-200 py-2 pl-9 pr-4 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto text-sm font-semibold">
          <Button className="whitespace-nowrap border-b-2 border-blue-600 pb-1 text-blue-600 transition-colors">
            Tất cả
          </Button>
          <Button className="whitespace-nowrap border-b-2 border-transparent pb-1 text-slate-500 hover:text-slate-800 transition-colors">
            Chờ xác nhận
          </Button>
          <Button className="whitespace-nowrap border-b-2 border-transparent pb-1 text-slate-500 hover:text-slate-800 transition-colors">
            Đang xử lý
          </Button>
          <Button className="whitespace-nowrap border-b-2 border-transparent pb-1 text-slate-500 hover:text-slate-800 transition-colors">
            Hoàn thành
          </Button>
        </div>
      </div>

      {/* Right side: Dropdowns */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select className="appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none">
            <option>Kênh: Tất cả</option>
            <option>Website</option>
            <option>Tại quầy</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>

        <div className="relative">
          <select className="appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none">
            <option>Ngày: Hôm nay</option>
            <option>Tuần này</option>
            <option>Tháng này</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>
      </div>

    </div>
  );
}
