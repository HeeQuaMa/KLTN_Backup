import { Input } from "@/components/ui/input";
export function ProductFormPricing() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-slate-800">2. Giá bán & Kho</h2>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Giá nhập (VNĐ)</label>
          <Input
            type="text"
            placeholder="12.500.000"
            className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Giá bán lẻ (VNĐ)</label>
          <Input
            type="text"
            placeholder="14.990.000"
            className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Thuế VAT (%)</label>
          <Input
            type="text"
            placeholder="8"
            className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 w-full sm:w-1/3 pr-2">
        <label className="text-sm font-semibold text-slate-700">Tồn kho ban đầu (Kho tổng)</label>
        <Input
          type="text"
          placeholder="0 (Cập nhật ở Nhập kho)"
          disabled
          className="w-full rounded-md border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-400 cursor-not-allowed focus:outline-none"
        />
      </div>
    </div>
  );
}
