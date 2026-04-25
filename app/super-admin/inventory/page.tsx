import { InventoryHeader } from "@/features/super-admin/inventory/components/InventoryHeader";
import { InventorySummary } from "@/features/super-admin/inventory/components/InventorySummary";
import { InventoryFilterBar } from "@/features/super-admin/inventory/components/InventoryFilterBar";
import { InventoryTable } from "@/features/super-admin/inventory/components/InventoryTable";

export default function SuperAdminInventoryPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <InventoryHeader />
      <InventorySummary />
      <InventoryFilterBar />
      <InventoryTable />
    </div>
  );
}
