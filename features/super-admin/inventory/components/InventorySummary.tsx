import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { Package, AlertCircle, CircleDollarSign } from "lucide-react";
import { formatDashboardMoney } from "@/features/super-admin/dashboard/utils/format";
import type { InventoryAdminStats } from "@/lib/api/inventoryApi";

const formatIntVi = (n: number) =>
  Math.round(n).toLocaleString("vi-VN");

export function InventorySummary(props: {
  stats: InventoryAdminStats | null;
  loading: boolean;
}) {
  const { stats, loading } = props;
  const skuDisplay =
    loading && !stats ? "—" : formatIntVi(stats?.totalSkus ?? 0);
  const alertDisplay =
    loading && !stats ? "—" : formatIntVi(stats?.lowStockCount ?? 0);
  const valueDisplay =
    loading && !stats
      ? "—"
      : formatDashboardMoney(stats?.inventoryValue ?? 0);

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <StatCard
        title="TỔNG SẢN PHẨM (SKU)"
        value={skuDisplay}
        trend="none"
        trendText=""
        icon={<Package className="h-5 w-5" />}
        iconBgColor="bg-orange-100"
        iconColor="text-orange-700"
      />
      <StatCard
        title="CẢNH BÁO SẮP HẾT"
        value={alertDisplay}
        trend="none"
        trendText={
          stats && stats.lowStockCount > 0 ? "Cần nhập hàng ngay" : ""
        }
        icon={<AlertCircle className="h-5 w-5" />}
        iconBgColor="bg-red-100"
        iconColor="text-red-500"
        valueColor="text-red-500"
      />
      <StatCard
        title="GIÁ TRỊ TỒN KHO"
        value={valueDisplay}
        trend="none"
        trendText=""
        icon={<CircleDollarSign className="h-5 w-5" />}
        iconBgColor="bg-green-100"
        iconColor="text-green-700"
      />
    </div>
  );
}
