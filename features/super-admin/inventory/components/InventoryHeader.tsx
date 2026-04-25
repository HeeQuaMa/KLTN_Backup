import { Button } from "@/components/ui/button";
import { Import, ClipboardCheck } from "lucide-react";

export function InventoryHeader() {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
      <h1 className="text-2xl font-bold text-slate-800">
        Quản lý Kho hàng Toàn hệ thống
      </h1>
      <div className="flex items-center gap-3">
        <Button variant="outline" className="border-slate-300 text-slate-700 hover:bg-slate-50 font-medium">
          <Import className="mr-2 h-4 w-4 text-blue-600" />
          Nhập kho
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
          <ClipboardCheck className="mr-2 h-4 w-4 text-yellow-300" />
          Kiểm kê
        </Button>
      </div>
    </div>
  );
}
