"use client";

import { Button } from "@/components/ui/button";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

const menuItems = [
  { href: "/profile", label: "Thông tin tài khoản" },
  { href: "/profile/orders", label: "Lịch sử mua hàng" },
  { href: "/profile/addresses", label: "Sổ địa chỉ nhận hàng" },
  { href: "/profile/warranty", label: "Lịch sử bảo hành" },
  { href: "/profile/change-password", label: "Đổi mật khẩu" },
];

export const ProfileSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Only render during hydration or if logged out user sneaks in
  if (!user) return null;

  return (
    <div className="flex w-full flex-col gap-4 md:w-[280px] shrink-0">
      {/* User Info Card */}
      <div className="flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#dbeafe] text-xl font-bold text-primary">
          {user?.name?.charAt(0)?.toUpperCase() || "U"}
        </div>
        <div className="flex flex-col">
          <span className="text-[14px] font-bold text-heading">{user?.name || "User"}</span>
          <span className="text-[13px] text-muted-foreground">Thành viên</span>
        </div>
      </div>

      {/* Menu Navigation */}
      <div className="flex flex-col rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden py-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex h-12 w-full items-center px-5 text-[14px] font-semibold transition-colors",
                isActive
                  ? "bg-[#eff6ff] text-primary border-l-4 border-l-primary pl-[16px]"
                  : "text-gray-600 hover:bg-gray-50 border-l-4 border-transparent pl-[16px]"
              )}
            >
              {item.label}
            </Link>
          );
        })}

        {/* Divider */}
        <div className="mx-5 my-1 h-px bg-gray-100" />

        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          className="flex h-12 w-full items-center px-5 text-[14px] font-semibold text-destructive transition-colors hover:bg-red-50 border-l-4 border-transparent pl-[16px]"
        >
          Đăng xuất
        </Button>
      </div>
    </div>
  );
};
