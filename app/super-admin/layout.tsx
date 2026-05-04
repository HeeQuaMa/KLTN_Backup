"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SuperAdminSidebar } from "@/components/layouts/super-admin/SuperAdminSidebar";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // 1. NGƯỜI BẢO VỆ TÌM CHÌA KHÓA
    const token = localStorage.getItem("admin_token");
    const adminInfo = localStorage.getItem("admin_info");

    if (!token || !adminInfo) {
      // 2. NẾU KHÔNG CÓ -> ĐUỔI RA NGOÀI CỔNG ĐĂNG NHẬP
      router.push("/admin-login");
    } else {
      // 3. NẾU CÓ -> MỞ CỬA CHO VÀO
      setIsAuthorized(true);
    }
  }, [router]);

  // Trong lúc chờ check token (khoảng 0.1s), tạm thời che đi nội dung bên trong
  // để tránh việc giao diện Admin bị chớp lên một cái rồi mới văng ra ngoài
  if (!isAuthorized) {
    return null; 
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <SuperAdminSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  );
}