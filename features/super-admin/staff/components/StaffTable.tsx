import { Button } from "@/components/ui/button";
import { Pencil, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

const staffList = [
  {
    id: "NV-01",
    name: "Le Van Quan",
    email: "quan.le@nettech.com",
    role: "Store Manager",
    branch: "Chi nhánh Quận 5 - HCM",
    status: "Hoạt động",
    avatarColor: "bg-blue-100 text-blue-700",
  },
  {
    id: "NV-02",
    name: "Tran Tien Phat",
    email: "phat.tran@nettech.com",
    role: "Sales Staff",
    branch: "Chi nhánh Quận 1 - HCM",
    status: "Hoạt động",
    avatarColor: "bg-slate-100 text-slate-700",
  },
  {
    id: "NV-03",
    name: "Tran Van Kho",
    email: "kho.tran@nettech.com",
    role: "Warehouse Staff",
    branch: "Kho Tổng (Central Warehouse)",
    status: "Hoạt động",
    avatarColor: "bg-slate-100 text-slate-700",
  },
  {
    id: "NV-04",
    name: "Nguyen Van Huy",
    email: "huy.nguyen@nettech.com",
    role: "Sales Staff",
    branch: "Chi nhánh Gò Vấp",
    status: "Đã khóa",
    avatarColor: "bg-red-100 text-red-700",
  },
];

const getInitials = (name: string) => {
  const parts = name.trim().split(" ");
  if (parts.length === 0) return "?";
  return parts[parts.length - 1][0].toUpperCase();
};

export function StaffTable() {
  return (
    <div className="rounded-xl bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-xs text-slate-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">NHÂN VIÊN</th>
              <th className="px-6 py-4 font-semibold">VAI TRÒ (ROLE)</th>
              <th className="px-6 py-4 font-semibold">CHI NHÁNH QUẢN LÝ</th>
              <th className="px-6 py-4 font-semibold">TRẠNG THÁI</th>
              <th className="px-6 py-4 font-semibold text-center">HÀNH ĐỘNG</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {staffList.map((staff) => (
              <tr key={staff.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {/* Avatar Initials */}
                    <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold", staff.avatarColor)}>
                      {getInitials(staff.name)}
                    </div>
                    {/* Name & Email */}
                    <div className="flex flex-col">
                      <span className="font-semibold text-slate-800">{staff.name}</span>
                      <span className="text-xs text-slate-400">{staff.email}</span>
                    </div>
                  </div>
                </td>
                
                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                      staff.role === "Store Manager"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-slate-100 text-slate-700"
                    )}
                  >
                    {staff.role}
                  </span>
                </td>

                <td className="px-6 py-4 text-slate-600">
                  {staff.branch}
                </td>

                <td className="px-6 py-4">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                      staff.status === "Hoạt động"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    )}
                  >
                    {staff.status}
                  </span>
                </td>
                
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-3">
                    <Button className="text-slate-400 hover:text-blue-600 transition-colors" title="Chỉnh sửa">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button className="text-slate-400 hover:text-yellow-600 transition-colors" title="Phân quyền / Mật khẩu">
                      <Lock className="h-4 w-4" />
                    </Button>
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
