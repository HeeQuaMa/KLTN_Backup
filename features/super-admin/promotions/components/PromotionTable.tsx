"use client";

import { cn } from "@/lib/utils";

// 1. Khai báo Props nhận từ component cha
interface PromotionTableProps {
  promotions: any[];
  loading: boolean;
}

// Hàm hỗ trợ hiển thị thanh Progress
function UsageBar({ count, limit }: { count: number; limit: number }) {
  // Backend lưu limit = 0 nghĩa là không giới hạn (∞)
  if (!limit || limit === 0) {
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="text-sm font-semibold text-slate-700">
          {count.toLocaleString("vi-VN")} / ∞
        </span>
      </div>
    );
  }

  const percentage = Math.min((count / limit) * 100, 100);

  return (
    <div className="flex flex-col items-center gap-1.5 min-w-[100px]">
      <span className="text-sm font-semibold text-slate-700">
        {count.toLocaleString("vi-VN")} / {limit.toLocaleString("vi-VN")}
      </span>
      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            percentage >= 100
              ? "bg-slate-400"
              : percentage >= 75
                ? "bg-amber-500"
                : "bg-blue-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// 2. Nhận props vào Component
export function PromotionTable({ promotions, loading }: PromotionTableProps) {
  
  // Hàm format tiền VNĐ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  // Hàm format ngày tháng
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Hàm tính toán trạng thái thực tế dựa vào Database
  const getStatusInfo = (item: any) => {
    const now = new Date();
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);

    if (!item.isActive) {
      return { text: "Đã khóa", color: "bg-red-100 text-red-700 border-red-200", isPing: false };
    }
    if (now < startDate) {
      return { text: "Sắp diễn ra", color: "bg-yellow-100 text-yellow-700 border-yellow-200", isPing: false };
    }
    if (now > endDate) {
      return { text: "Kết thúc", color: "bg-slate-100 text-slate-500 border-slate-200", isPing: false };
    }
    if (item.usageLimit > 0 && item.usedCount >= item.usageLimit) {
      return { text: "Hết lượt", color: "bg-slate-100 text-slate-500 border-slate-200", isPing: false };
    }
    
    return { text: "Đang chạy", color: "bg-green-100 text-green-700 border-green-200", isPing: true };
  };

  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 font-bold uppercase tracking-wider">
              <th className="px-6 py-4">Mã Code</th>
              <th className="px-6 py-4">Tên chương trình</th>
              <th className="px-6 py-4">Loại giảm giá</th>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4">Lượt dùng</th>
              <th className="px-6 py-4 text-right">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {/* Hiển thị Loading */}
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : promotions.length === 0 ? (
              /* Hiển thị nếu mảng rỗng */
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-slate-500 font-medium">
                  Không tìm thấy chương trình khuyến mãi nào.
                </td>
              </tr>
            ) : (
              /* Map dữ liệu thật từ Backend */
              promotions.map((item) => {
                const status = getStatusInfo(item);

                return (
                  <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                    {/* Mã Code */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full border-2 border-amber-400 px-3 py-1 text-xs font-bold text-amber-600 bg-amber-50">
                        {item.code}
                      </span>
                    </td>

                    {/* Tên chương trình */}
                    <td className="px-6 py-4 font-bold text-slate-800">
                      {item.description}
                    </td>

                    {/* Loại giảm giá */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700">
                          {item.discountType === 'Percentage' 
                            ? `Giảm ${item.discountValue}%` 
                            : `Giảm ${formatCurrency(item.discountValue)}`
                          }
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5">
                          {item.minOrderValue > 0 ? `Đơn > ${formatCurrency(item.minOrderValue)}` : 'Áp dụng mọi đơn hàng'}
                        </span>
                      </div>
                    </td>

                    {/* Thời gian */}
                    <td className="px-6 py-4 text-slate-600">
                      {formatDate(item.startDate)} - {formatDate(item.endDate)}
                    </td>

                    {/* Lượt dùng */}
                    <td className="px-6 py-4">
                      <UsageBar count={item.usedCount || 0} limit={item.usageLimit} />
                    </td>

                    {/* Trạng thái */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end">
                        <span className={cn("inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold border", status.color)}>
                          {status.isPing && (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                            </span>
                          )}
                          {status.text}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}