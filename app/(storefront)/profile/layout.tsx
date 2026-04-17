import React from "react";
import { ProfileSidebar } from "@/features/storefront/profile/components";

export const metadata = {
  title: "Thông tin cá nhân | NetTech",
  description: "Trang thông tin tài khoản người dùng NetTech",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-gray-50/50 py-8">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-6 px-4 md:px-8 lg:flex-row lg:items-start lg:gap-8 xl:px-16">
        {/* Left Column: Navigation Sidebar */}
        <ProfileSidebar />

        {/* Right Column: Page Content */}
        <div className="flex-1 w-full">
          {children}
        </div>
      </div>
    </main>
  );
}
