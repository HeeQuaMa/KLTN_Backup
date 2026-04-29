import { Camera } from "lucide-react";

export function ProductFormImage() {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-slate-800">4. Hình ảnh</h2>
      
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-blue-200 bg-blue-50/30 py-12 px-6 text-center hover:bg-blue-50/50 cursor-pointer transition-colors">
        <Camera className="mb-3 h-8 w-8 text-slate-400" />
        <p className="text-sm font-semibold text-blue-600">Kéo thả ảnh vào đây</p>
        <p className="mt-1 text-xs text-slate-500">hoặc nhấn để tải lên</p>
      </div>
    </div>
  );
}
