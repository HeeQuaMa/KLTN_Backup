"use client";

import { Users, UserPlus, Crown } from "lucide-react";
import { StatCard } from "@/features/super-admin/shared/components/StatCard";
import { MemberFilterBar } from "@/features/super-admin/members/components/MemberFilterBar";
import { MemberTable } from "@/features/super-admin/members/components/MemberTable";

export default function SuperAdminMembersPage() {
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
          value="1,250"
          trend="none"
          trendText=""
          icon={<Users className="h-4 w-4" />}
          iconBgColor="bg-blue-100"
          iconColor="text-blue-600"
          valueColor="text-slate-800"
        />
        <StatCard
          title="KHÁCH MỚI (THÁNG NÀY)"
          value="120"
          trend="up"
          trendText="15% so với tháng trước"
          icon={<UserPlus className="h-4 w-4" />}
          iconBgColor="bg-green-100"
          iconColor="text-green-600"
          valueColor="text-slate-800"
        />
        <StatCard
          title="THÀNH VIÊN VIP (GOLD+)"
          value="85"
          trend="none"
          trendText=""
          icon={<Crown className="h-4 w-4" />}
          iconBgColor="bg-yellow-100"
          iconColor="text-yellow-600"
          valueColor="text-slate-800"
        />
      </div>

      {/* Filter Bar */}
      <MemberFilterBar />

      {/* Data Table */}
      <MemberTable />
    </div>
  );
}
