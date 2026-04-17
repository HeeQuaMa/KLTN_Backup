"use client";

import React, { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
function Header() {
  const { isLoggedIn, user } = useAuthStore();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const [mounted, setMounted] = useState(false);

  const fetchAndSyncCart = useCartStore((state) => state.fetchAndSyncCart);

  useEffect(() => {
    setMounted(true);
    if (isLoggedIn && user) {
      fetchAndSyncCart();
    }
  }, [isLoggedIn, user, fetchAndSyncCart]);

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 transition-all md:px-8 lg:px-12 lg:py-6.25 xl:px-16">
      <div className="text-xl font-bold md:text-2xl lg:text-[32px]">
        <Link href={"/"}>
          <span className="text-primary">Net</span>Tech
        </Link>
      </div>
      <div className="order-last flex h-10 w-full lg:order-0 lg:h-12.5 lg:w-auto">
        <Input
          type="search"
          placeholder="Tìm kiếm linh kiện, Laptop, VGA..."
          className={cn("h-full flex-1 lg:w-150")}
        />
        <Button
          className={cn(
            "hover:bg-primary-hover/90 h-full cursor-pointer px-4 text-white lg:w-17.5",
          )}
        >
          Search
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/cart" className="group relative flex cursor-pointer items-center gap-2 text-sm md:text-base transition-colors hover:text-primary">
          <div className="relative">
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
            {mounted && totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white md:h-5 md:w-5 md:text-xs">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </div>
          <p className="hidden md:block">Giỏ hàng</p>
        </Link>
        <div className="flex items-center gap-2 lg:h-10">
          {mounted && isLoggedIn && user ? (
            <Link href="/profile" className="flex items-center gap-2 ml-4 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#005BAA] text-[15px] font-bold text-white shadow-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="hidden text-[14px] font-bold text-heading md:block whitespace-nowrap">
                {user?.name || "User"}
              </span>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button
                  className={cn(
                    "hover:bg-primary-hover/90 h-8 cursor-pointer px-3 text-sm text-white md:h-10 md:px-4 lg:w-30 lg:text-base",
                  )}
                >
                  Đăng nhập
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  className={cn(
                    "hover:bg-primary-hover/90 h-8 cursor-pointer px-3 text-sm text-white md:h-10 md:px-4 lg:w-30 lg:text-base",
                  )}
                >
                  Đăng ký
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
