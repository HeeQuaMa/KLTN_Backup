import { PromotionHeader } from "@/features/super-admin/promotions/components/PromotionHeader";
import { PromotionSummary } from "@/features/super-admin/promotions/components/PromotionSummary";
import { PromotionFilterBar } from "@/features/super-admin/promotions/components/PromotionFilterBar";
import { PromotionTable } from "@/features/super-admin/promotions/components/PromotionTable";

export default function SuperAdminPromotionsPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <PromotionHeader />
      <PromotionSummary />
      <PromotionFilterBar />
      <PromotionTable />
    </div>
  );
}
