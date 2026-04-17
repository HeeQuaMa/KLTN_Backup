import { Input } from "@/components/ui/input";
export function ProductFormGeneral() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-slate-800">1. Thông tin chung</h2>
      
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Tên sản phẩm *</label>
          <Input
            type="text"
            placeholder="Ví dụ: Intel Core i9-14900K"
            className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Mã SKU (Duy nhất) *</label>
            <Input
              type="text"
              placeholder="CPU-INT-149"
              className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Thương hiệu</label>
            <Input
              type="text"
              placeholder="Intel"
              className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Danh mục</label>
          <Input
            type="text"
            placeholder="Vi xử lý (CPU)"
            className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Mô tả sản phẩm</label>
          <textarea
            placeholder="Nhập mô tả chi tiết..."
            rows={5}
            className="w-full resize-y rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}
