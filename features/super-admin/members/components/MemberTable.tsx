import { Star, Circle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const members = [
  {
    id: "#MEM-001",
    name: "Nguyen Van A",
    email: "nguyenvan.a@gmail.com",
    phone: "0909 123 456",
    tier: "Gold",
    totalSpend: "150.000.000đ",
    joinDate: "20/01/2025",
  },
  {
    id: "#MEM-002",
    name: "Tran Thi B",
    email: "tranthib@gmail.com",
    phone: "0912 345 678",
    tier: "Silver",
    totalSpend: "35.000.000đ",
    joinDate: "15/05/2025",
  },
  {
    id: "#MEM-003",
    name: "Le Hoang C",
    email: "c.lehoang@yahoo.com",
    phone: "0988 777 666",
    tier: "Member",
    totalSpend: "2.500.000đ",
    joinDate: "22/01/2026",
  },
];

export function MemberTable() {
  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
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
            {members.map((member) => (
              <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 font-semibold text-blue-600">
                  {member.id}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-800">{member.name}</span>
                    <span className="text-xs text-slate-400">{member.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">{member.phone}</td>
                
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
                  {member.tier === "Member" && (
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Member
                    </span>
                  )}
                </td>

                <td className="px-6 py-4 font-bold text-slate-800">
                  {member.totalSpend}
                </td>
                
                <td className="px-6 py-4 text-slate-500">
                  {member.joinDate}
                </td>

                <td className="px-6 py-4 text-center">
                  <Link 
                    href="#" 
                    className="text-blue-600 font-semibold hover:underline text-sm"
                  >
                    Chi tiết
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
