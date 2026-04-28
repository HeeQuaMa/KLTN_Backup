"use client";

import { cn } from "@/lib/utils";

type PromotionStatus = "Đang chạy" | "Kết thúc";

interface PromotionData {
  id: number;
  code: string;
  name: string;
  discountType: string;
  discountDetail: string;
  condition: string;
  timeRange: string;
  usageCount: number;
  usageLimit: number | null; // null = unlimited (∞)
  status: PromotionStatus;
}

const mockPromotionData: PromotionData[] = [
  {
    id: 1,
    code: "TET2026",
    name: "Siêu Sale Đón Tết",
    discountType: "Giảm 10%",
    discountDetail: "Tối đa 500k. Đơn > 2tr",
    condition: "",
    timeRange: "01/01 - 30/01/2026",
    usageCount: 850,
    usageLimit: 1000,
    status: "Đang chạy",
  },
  {
    id: 2,
    code: "FREESHIP",
    name: "Miễn phí vận chuyển",
    discountType: "Giảm 100% Phí ship",
    discountDetail: "Đơn > 500k",
    condition: "",
    timeRange: "Không thời hạn",
    usageCount: 3400,
    usageLimit: null,
    status: "Đang chạy",
  },
  {
    id: 3,
    code: "BLACKFRIDAY",
    name: "Sàn Sale Thứ 6",
    discountType: "Giảm 20%",
    discountDetail: "",
    condition: "",
    timeRange: "25/11 - 27/11/2025",
    usageCount: 500,
    usageLimit: 500,
    status: "Kết thúc",
  },
];

function UsageBar({
  count,
  limit,
}: {
  count: number;
  limit: number | null;
}) {
  if (limit === null) {
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

export function PromotionTable() {
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
            {mockPromotionData.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50 transition-colors"
              >
                {/* Mã Code */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center rounded-full border-2 border-amber-400 px-3 py-1 text-xs font-bold text-amber-600 bg-amber-50">
                    {item.code}
                  </span>
                </td>

                {/* Tên chương trình */}
                <td className="px-6 py-4 font-bold text-slate-800">
                  {item.name}
                </td>

                {/* Loại giảm giá */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-medium text-slate-700">
                      {item.discountType}
                    </span>
                    {item.discountDetail && (
                      <span className="text-xs text-slate-400 mt-0.5">
                        {item.discountDetail}
                      </span>
                    )}
                  </div>
                </td>

                {/* Thời gian */}
                <td className="px-6 py-4 text-slate-600">
                  {item.timeRange}
                </td>

                {/* Lượt dùng */}
                <td className="px-6 py-4">
                  <UsageBar
                    count={item.usageCount}
                    limit={item.usageLimit}
                  />
                </td>

                {/* Trạng thái */}
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
                        item.status === "Đang chạy"
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-slate-100 text-slate-500 border border-slate-200"
                      )}
                    >
                      {item.status === "Đang chạy" && (
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      )}
                      {item.status}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
