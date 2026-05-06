"use client";

import { Star, Circle, Loader2 } from "lucide-react";
import Link from "next/link";
import { Member } from "@/lib/api/memberApi";

interface MemberTableProps {
  data: Member[];
  isLoading: boolean;
}

const formatCurrency = (value: unknown): string => {
  const numericValue = Number(value);
  const safeValue = Number.isFinite(numericValue) ? numericValue : 0;
  return `${new Intl.NumberFormat("vi-VN").format(safeValue)}đ`;
};

export function MemberTable({ data, isLoading }: MemberTableProps) {
  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden min-h-[400px] relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">MÃ KH</th>
              <th className="px-6 py-4 font-semibold">HỌ VÀ TÊN</th>
              <th className="px-6 py-4 font-semibold">SỐ ĐIỆN THOẠI</th>
              <th className="px-6 py-4 font-semibold">HẠNG THẺ</th>
              <th className="px-6 py-4 font-semibold">TỔNG CHI TIÊU</th>
              <th className="px-6 py-4 font-semibold">NGÀY GIA NHẬP</th>
              <th className="px-6 py-4 font-semibold text-center">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  Không tìm thấy khách hàng nào.
                </td>
              </tr>
            ) : (
              data.map((member) => (
                <tr
                  key={member._id}
                  className="hover:bg-slate-50 transition-colors"
                >
                  <td className="px-6 py-4 font-semibold text-blue-600">
                    {member.memberCode || "#MEM-XXX"}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{member.fullName}</span>
                      <span className="text-xs text-slate-400">{member.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{member.phone || "N/A"}</td>
                  
                  <td className="px-6 py-4">
                    {member.tier === "Gold" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
                        <Star className="h-3 w-3 fill-yellow-700" /> Gold
                      </span>
                    )}
                    {member.tier === "Silver" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                        <Circle className="h-2 w-2 fill-blue-700" /> Silver
                      </span>
                    )}
                    {(member.tier === "Member" || !member.tier) && (
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        Member
                      </span>
                    )}
                    {member.tier === "Platinum" && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                        <Star className="h-3 w-3 fill-purple-700" /> Platinum
                      </span>
                    )}
                  </td>

                  <td className="px-6 py-4 font-bold text-slate-800">
                    {formatCurrency(member.totalSpent)}
                  </td>
                  
                  <td className="px-6 py-4 text-slate-500">
                    {new Date(member.createdAt).toLocaleDateString("vi-VN")}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <Link 
                      href={`/super-admin/members/${member._id}`} 
                      className="text-blue-600 font-semibold hover:underline text-sm"
                    >
                      Chi tiết
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}