"use client";

import { SuperAdminSidebar } from "@/components/layouts/super-admin/SuperAdminSidebar";
import NotificationProvider from "@/components/providers/NotificationProvider";

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {

  return (
    <div className="flex min-h-screen bg-slate-50">
      <NotificationProvider>
        <SuperAdminSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </NotificationProvider>
    </div>
  );
}