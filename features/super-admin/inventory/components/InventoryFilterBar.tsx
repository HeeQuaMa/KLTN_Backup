import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function InventoryFilterBar() {
  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Tìm SKU, Tên SP..."
          className="pl-9 h-10 w-full md:max-w-md bg-slate-50 border-slate-200"
        />
      </div>
      
      <div className="flex items-center gap-3">
        <Select defaultValue="all">
          <SelectTrigger className="w-[200px] h-10 bg-slate-50 border-slate-200">
            <SelectValue placeholder="Chọn kho" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Kho: Tất cả chi nhánh</SelectItem>
            <SelectItem value="q5">Chi nhánh Quận 5</SelectItem>
            <SelectItem value="q1">Chi nhánh Quận 1</SelectItem>
            <SelectItem value="q10">Chi nhánh Quận 10</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
