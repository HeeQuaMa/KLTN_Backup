"use client";

import { StaffFilterBar } from "@/features/super-admin/staff/components/StaffFilterBar";
import { StaffTable } from "@/features/super-admin/staff/components/StaffTable";

export default function SuperAdminStaffPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">
          Quản lý Nhân sự & Phân quyền (RBAC)
        </h1>
      </div>

      {/* Filter Bar */}
      <StaffFilterBar />

      {/* Data Table */}
      <StaffTable />
    </div>
  );
}
