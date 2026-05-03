import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { Ticket, MessageSquare, TrendingDown } from "lucide-react";

export function PromotionSummary({ promotions }: { promotions: any[] }) {
  // 1. Đếm số chương trình đang chạy
  const activeCount = promotions.filter(p => p.isActive && new Date(p.endDate) >= new Date()).length;
  
  // 2. Tổng lượt dùng
  const totalUsed = promotions.reduce((sum, p) => sum + (p.usedCount || 0), 0);

  // 3. Tính toán TỔNG TIỀN ĐÃ GIẢM (Ước tính)
  const totalDiscounted = promotions.reduce((sum, promo) => {
    if (!promo.usedCount || promo.usedCount === 0) return sum;

    // Nếu là mã giảm tiền cố định -> Tính chính xác 100%
    if (promo.discountType === 'Fixed Amount' || promo.discountType === 'fixed') {
      return sum + (promo.discountValue * promo.usedCount);
    } 
    // Nếu là mã giảm % -> Khó tính chính xác vì không có giá trị đơn hàng.
    // Tạm ước tính: Giả sử trung bình mỗi đơn dùng mã % được giảm khoảng 150.000đ
    else {
      const estimatedDiscountPerOrder = 150000; 
      return sum + (estimatedDiscountPerOrder * promo.usedCount);
    }
  }, 0);

  // Hàm format số lớn thành chữ M (Triệu), K (Nghìn) cho đẹp (VD: 15500000 -> 15.5M)
  const formatCompactNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      <StatCard
        title="CHƯƠNG TRÌNH ĐANG CHẠY"
        value={activeCount.toString()}
        trend="none" trendText=""
        icon={<Ticket className="h-5 w-5" />} iconBgColor="bg-blue-100" iconColor="text-blue-700"
      />
      <StatCard
        title="TỔNG LƯỢT SỬ DỤNG (THÁNG)"
        value={totalUsed.toLocaleString("vi-VN")}
        trend="none" trendText=""
        icon={<MessageSquare className="h-5 w-5" />} iconBgColor="bg-green-100" iconColor="text-green-700"
      />
      <StatCard
        title="TỔNG TIỀN ĐÃ GIẢM (ƯỚC TÍNH)"
        value={formatCompactNumber(totalDiscounted)}
        trend="none" trendText=""
        icon={<TrendingDown className="h-5 w-5" />} iconBgColor="bg-sky-100" iconColor="text-sky-600"
      />
    </div>
  );
}