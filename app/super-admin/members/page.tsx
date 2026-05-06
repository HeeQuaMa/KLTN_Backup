"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Users, UserPlus, Crown } from "lucide-react";
import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { MemberFilterBar } from "@/features/super-admin/members/components/MemberFilterBar";
import { MemberTable } from "@/features/super-admin/members/components/MemberTable";
import { getMembers, getMemberStats, Member, MemberStats } from "@/lib/api/memberApi";

function SuperAdminMembersContent() {
  const searchParams = useSearchParams();

  const [members, setMembers] = useState<Member[]>([]);
  const [stats, setStats] = useState<MemberStats | null>(null);
  const [loading, setLoading] = useState(true);

  // Lấy params từ URL (Đã bổ sung lấy status)
  const page = Number(searchParams.get("page")) || 1;
  const search = searchParams.get("search") || "";
  const tier = searchParams.get("tier") || "";
  const status = searchParams.get("status") || "ACTIVE"; // <-- Bổ sung biến này

  // Hàm gọi API
  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsData, listData] = await Promise.all([
        getMemberStats(),
        getMembers({ 
          page, 
          limit: 10, 
          search, 
          tier: tier === "all" ? undefined : tier,
          status // <-- Truyền status xuống hàm API
        })
      ]);
      setStats(statsData);
      setMembers(listData.data);
    } catch (error) {
      console.error("Lỗi fetch dữ liệu Member:", error);
    } finally {
      setLoading(false);
    }
  };

  // Lắng nghe thay đổi URL (Nhớ thêm status vào mảng này)
  useEffect(() => {
    fetchData();
  }, [page, search, tier, status]); // <-- Khi đổi status thì tự fetch lại data

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Danh sách Khách hàng Thành viên
        </h1>
      </div>

      {/* Cards Row */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          title="TỔNG THÀNH VIÊN"
          value={stats?.totalMembers.toLocaleString() || "0"}
          icon={<Users className="h-4 w-4" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          valueColor="text-slate-800"
        />
        <StatCard
          title="KHÁCH MỚI (THÁNG NÀY)"
          value={stats?.newThisMonth?.count.toString() || "0"}
          trend={stats?.newThisMonth?.trend || "none"}
          trendText={stats?.newThisMonth?.trendText || ""}
          icon={<UserPlus className="h-4 w-4" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          valueColor="text-slate-800"
        />
        <StatCard
          title="THÀNH VIÊN VIP (GOLD+)"
          value={stats?.vipMembers.toLocaleString() || "0"}
          icon={<Crown className="h-4 w-4" />}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          valueColor="text-slate-800"
        />
      </div>

      {/* Filter Bar */}
      <MemberFilterBar />

      {/* Data Table */}
      <MemberTable data={members} isLoading={loading} />
    </div>
  );
}

export default function SuperAdminMembersPage() {
  return (
    <Suspense fallback={<div className="p-8">Đang tải...</div>}>
      <SuperAdminMembersContent />
    </Suspense>
  );
}