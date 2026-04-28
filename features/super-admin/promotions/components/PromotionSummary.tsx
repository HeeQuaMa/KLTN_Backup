import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { Ticket, MessageSquare, TrendingDown } from "lucide-react";

export function PromotionSummary() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <StatCard
        title="CHƯƠNG TRÌNH ĐANG CHẠY"
        value="5"
        trend="none"
        trendText=""
        icon={<Ticket className="h-5 w-5" />}
        iconBgColor="bg-blue-100"
        iconColor="text-blue-700"
      />
      <StatCard
        title="TỔNG LƯỢT SỬ DỤNG (THÁNG)"
        value="1,208"
        trend="none"
        trendText=""
        icon={<MessageSquare className="h-5 w-5" />}
        iconBgColor="bg-green-100"
        iconColor="text-green-700"
      />
      <StatCard
        title="TỔNG TIỀN ĐÃ GIẢM"
        value="85.5M"
        trend="none"
        trendText=""
        icon={<TrendingDown className="h-5 w-5" />}
        iconBgColor="bg-sky-100"
        iconColor="text-sky-600"
      />
    </div>
  );
}
