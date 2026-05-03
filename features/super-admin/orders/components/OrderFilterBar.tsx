import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";
import type {
  AdminOrderChannel,
  AdminOrderDate,
  AdminOrderTab,
} from "@/lib/api/adminOrdersApi";

export type OrderFilterBarProps = {
  search: string;
  onSearchChange: (v: string) => void;
  tab: AdminOrderTab;
  onTab: (t: AdminOrderTab) => void;
  channel: AdminOrderChannel;
  onChannel: (c: AdminOrderChannel) => void;
  date: AdminOrderDate;
  onDate: (d: AdminOrderDate) => void;
};

export function OrderFilterBar({
  search,
  onSearchChange,
  tab,
  onTab,
  channel,
  onChannel,
  date,
  onDate,
}: OrderFilterBarProps) {
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
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto text-sm font-semibold">
          <Button
            type="button"
            className={
              tab === "all"
                ? "whitespace-nowrap border-b-2 border-blue-600 pb-1 text-blue-600 transition-colors"
                : "whitespace-nowrap border-b-2 border-transparent pb-1 text-slate-500 hover:text-slate-800 transition-colors"
            }
            onClick={() => onTab("all")}
          >
            Tất cả
          </Button>
          <Button
            type="button"
            className={
              tab === "pending"
                ? "whitespace-nowrap border-b-2 border-blue-600 pb-1 text-blue-600 transition-colors"
                : "whitespace-nowrap border-b-2 border-transparent pb-1 text-slate-500 hover:text-slate-800 transition-colors"
            }
            onClick={() => onTab("pending")}
          >
            Chờ xác nhận
          </Button>
          <Button
            type="button"
            className={
              tab === "processing"
                ? "whitespace-nowrap border-b-2 border-blue-600 pb-1 text-blue-600 transition-colors"
                : "whitespace-nowrap border-b-2 border-transparent pb-1 text-slate-500 hover:text-slate-800 transition-colors"
            }
            onClick={() => onTab("processing")}
          >
            Đang xử lý
          </Button>
          <Button
            type="button"
            className={
              tab === "completed"
                ? "whitespace-nowrap border-b-2 border-blue-600 pb-1 text-blue-600 transition-colors"
                : "whitespace-nowrap border-b-2 border-transparent pb-1 text-slate-500 hover:text-slate-800 transition-colors"
            }
            onClick={() => onTab("completed")}
          >
            Hoàn thành
          </Button>
        </div>
      </div>

      {/* Right side: Dropdowns */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <select
            className="appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
            value={channel}
            onChange={(e) => onChannel(e.target.value as AdminOrderChannel)}
          >
            <option value="all">Kênh: Tất cả</option>
            <option value="ONLINE">Website</option>
            <option value="O2O">Tại quầy</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>

        <div className="relative">
          <select
            className="appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm font-medium text-slate-700 focus:border-blue-500 focus:outline-none"
            value={date}
            onChange={(e) => onDate(e.target.value as AdminOrderDate)}
          >
            <option value="today">Ngày: Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        </div>
      </div>
    </div>
  );
}
