"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SUPER_ADMIN_NAV_ITEMS } from "@/constants/super-admin";

export function SuperAdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-64 flex-col bg-[#111827] text-slate-300">
      <div className="flex h-16 items-center border-b border-slate-800 px-6 font-bold tracking-wider">
        <span className="text-xl text-white">NET</span>
        <span className="text-xl text-[#3b82f6]">TECH</span>
        <span className="ml-2 text-xl text-white">ADMIN</span>
      </div>

      <div className="flex items-center gap-4 border-b border-slate-800 p-6">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-700 text-sm font-bold text-white">
          SA
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-white">Super Admin</span>
          <span className="text-xs text-slate-400">Quản trị viên cao cấp</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="flex flex-col gap-1">
          {SUPER_ADMIN_NAV_ITEMS.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-6 py-3 text-sm transition-colors hover:bg-slate-800 hover:text-white",
                  pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/super-admin")
                    ? "border-l-4 border-blue-500 bg-slate-800 text-blue-500 font-medium"
                    : "border-l-4 border-transparent"
                )}
              >
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
