import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, ChevronDown } from "lucide-react";

export function ProductFormSpecs() {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center text-base font-bold text-blue-600">
          <Sparkles className="mr-2 h-5 w-5 text-yellow-500" fill="currentColor" />
          3. Thông số Build PC (AI)
        </h2>
        <span className="text-xs font-semibold text-blue-500">Quan trọng</span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Socket Type</label>
          <div className="relative">
            <select className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500">
              <option>LGA 1700</option>
              <option>AM5</option>
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">TDP (Công suất nhiệt - W)</label>
          <Input
            type="text"
            placeholder="125"
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Hỗ trợ RAM</label>
          <div className="flex gap-2">
            <Button className="rounded-md border border-blue-500 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600 focus:outline-none">
              DDR5
            </Button>
            <Button className="rounded-md border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 focus:outline-none">
              DDR4
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Có iGPU (Đồ họa tích hợp)?</label>
          <div className="flex items-center gap-2">
            <Button className="relative inline-flex h-6 w-11 items-center rounded-full bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
              <span className="inline-block h-4 w-4 translate-x-6 transform rounded-full bg-white transition-transform" />
            </Button>
            <span className="text-sm font-semibold text-green-600">Có</span>
          </div>
        </div>

        <div className="mt-2 rounded-md border border-orange-200 bg-orange-50 p-3">
          <p className="text-xs text-orange-600">
            Lưu ý: Dữ liệu này sẽ được AI sử dụng để kiểm tra tương thích khi khách Build PC.
          </p>
        </div>
      </div>
    </div>
  );
}
