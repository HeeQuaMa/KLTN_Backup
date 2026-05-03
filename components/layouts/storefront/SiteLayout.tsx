"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header, Navigation, Footer } from "@/components/layouts/storefront";
import { ScrollToTop, AIChatBox } from "@/components/shared";

export const SiteLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  // Kiểm tra xem trang hiện tại có phải là trang Auth không
  const isAuthPage =
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot-password");

  return (
    <>
      {/* isolate + z-[100]: header row uses z-[10000] so account dropdown stays
          above the blue Navigation bar (nav is z-10); both sit above <main>. */}
      {!isAuthPage && (
        <div className="relative z-[100] isolate">
          <Header />
          <Navigation />
        </div>
      )}

      <main className="flex w-full grow flex-col bg-white">{children}</main>

      {!isAuthPage && <ScrollToTop />}
      {!isAuthPage && <AIChatBox />}
      {!isAuthPage && <Footer />}
    </>
  );
};

export default SiteLayout;
