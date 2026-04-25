import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { Package, AlertCircle, CircleDollarSign } from "lucide-react";

export function InventorySummary() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <StatCard
        title="TỔNG SẢN PHẨM (SKU)"
        value="2,540"
        trend="none"
        trendText=""
        icon={<Package className="h-5 w-5" />}
        iconBgColor="bg-orange-100"
        iconColor="text-orange-700"
      />
      <StatCard
        title="CẢNH BÁO SẮP HẾT"
        value="15"
        trend="none"
        trendText="Cần nhập hàng ngay"
        icon={<AlertCircle className="h-5 w-5" />}
        iconBgColor="bg-red-100"
        iconColor="text-red-500"
        valueColor="text-red-500"
      />
      <StatCard
        title="GIÁ TRỊ TỒN KHO"
        value="5.2 Tỷ"
        trend="none"
        trendText=""
        icon={<CircleDollarSign className="h-5 w-5" />}
        iconBgColor="bg-green-100"
        iconColor="text-green-700"
      />
    </div>
  );
}
