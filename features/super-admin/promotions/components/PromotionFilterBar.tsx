import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FilterBarProps {
  search: string;
  setSearch: (val: string) => void;
}

export function PromotionFilterBar({ search, setSearch }: FilterBarProps) {
  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-xl shadow-sm md:flex-row md:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Tìm theo mã code hoặc tên..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10 w-full md:max-w-md bg-slate-50 border-slate-200"
        />
      </div>
    </div>
  );
}