import { SuperAdminSidebar } from "@/components/layouts/super-admin/SuperAdminSidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}
