"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";

/** Cần tách + bọc Suspense vì `useSearchParams` bắt buộc khi prerender (Next 16). */
function HeaderSearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Giữ ô tìm kiếm đồng bộ với ?search= trên trang danh sách sản phẩm
  useEffect(() => {
    if (pathname !== "/products") return;
    setSearchQuery(searchParams.get("search") ?? "");
  }, [pathname, searchParams]);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (pathname === "/products") {
      const params = new URLSearchParams(searchParams.toString());
      if (q) params.set("search", q);
      else params.delete("search");
      const qs = params.toString();
      router.push(qs ? `/products?${qs}` : "/products");
    } else if (q) {
      router.push(`/products?search=${encodeURIComponent(q)}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <form
      onSubmit={submitSearch}
      className="order-last flex h-10 w-full lg:order-0 lg:h-12.5 lg:w-auto"
    >
      <Input
        type="search"
        name="search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Tìm kiếm linh kiện, Laptop, VGA..."
        className={cn("h-full flex-1 lg:w-150")}
        autoComplete="off"
      />
      <Button
        type="submit"
        className={cn(
          "hover:bg-primary-hover/90 h-full cursor-pointer px-4 text-white lg:w-17.5",
        )}
      >
        Search
      </Button>
    </form>
  );
}

function HeaderSearchFallback() {
  return (
    <div className="order-last flex h-10 w-full lg:order-0 lg:h-12.5 lg:w-auto">
      <Input
        readOnly
        placeholder="Tìm kiếm linh kiện, Laptop, VGA..."
        className={cn("h-full flex-1 lg:w-150")}
      />
      <Button
        type="button"
        disabled
        className={cn(
          "hover:bg-primary-hover/90 h-full cursor-pointer px-4 text-white lg:w-17.5",
        )}
      >
        Search
      </Button>
    </div>
  );
}

function Header() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  const { isLoggedIn, user, logout } = useAuthStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    toast.info("Đã đăng xuất.", { autoClose: 1500 });
    router.push("/");
  };

  // Lấy chữ cái đầu của tên để hiển thị avatar
  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .slice(-2)
        .map((w: string) => w[0])
        .join("")
        .toUpperCase()
    : "U";
  return (
    <header className="relative z-[10000] flex flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-8 lg:px-12 lg:py-6.25 xl:px-16">
      {/* Logo */}
      <div className="text-xl font-bold md:text-2xl lg:text-[32px]">
        <Link href={"/"}>
          <span className="text-primary">Net</span>Tech
        </Link>
      </div>

      {/* Search */}
      <Suspense fallback={<HeaderSearchFallback />}>
        <HeaderSearchBar />
      </Suspense>

      {/* Right: Cart + Auth */}
      <div className="flex items-center gap-4">
        {/* Giỏ hàng */}
        <Link
          href="/cart"
          className="group hover:text-primary relative flex cursor-pointer items-center gap-2 text-sm transition-colors md:text-base"
        >
          <div className="relative">
            <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
            {mounted && totalItems > 0 && (
              <span className="bg-destructive absolute -top-2 -right-2 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold text-white md:h-5 md:w-5 md:text-xs">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </div>
          <p className="hidden md:block">Giỏ hàng</p>
        </Link>
        {/* --- ĐOẠN CODE CŨ ĐÃ ĐƯỢC COMMENT LẠI ---
        <div className="flex items-center gap-2 lg:h-10">
          {mounted && isLoggedIn && user ? (
            <Link href="/profile" className="flex items-center gap-2 ml-4 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#005BAA] text-[15px] font-bold text-white shadow-sm">
                {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <span className="hidden text-[14px] font-bold text-heading md:block whitespace-nowrap">
                {user?.fullName || "User"}
              </span>
            </Link>
          ) : (
        ------------------------------------------- */}

        {/* Auth buttons */}
        <div className="flex items-center gap-2 lg:h-10">
          {mounted && isLoggedIn ? (
            /* ── Trạng thái đã đăng nhập ── */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="hover:border-primary/40 hover:text-primary flex items-center gap-2 rounded-full border border-gray-200 bg-white py-1.5 pr-3 pl-1.5 text-sm font-semibold text-gray-700 shadow-sm transition-all"
              >
                {/* Avatar */}
                <span className="bg-primary flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white">
                  {user?.fullName?.charAt(0)?.toUpperCase() || "U"}
                </span>
                <span className="hidden max-w-24 truncate md:block">
                  {user?.fullName?.split(" ").pop() || "Tài khoản"}
                </span>
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform",
                    dropdownOpen && "rotate-180",
                  )}
                />
              </button>

              {/* Dropdown menu */}
              {dropdownOpen && (
                <div className="absolute top-full right-0 z-[10050] mt-2 w-44 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-2.5">
                    <p className="text-xs font-semibold text-gray-500">
                      Đã đăng nhập
                    </p>
                    <p className="truncate text-sm font-bold text-gray-900">
                      {user?.fullName || "Tài khoản"}
                    </p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="hover:text-primary flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                  >
                    <User className="h-4 w-4" /> Tài khoản của tôi
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-500 transition-colors hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ── Trạng thái chưa đăng nhập ── */
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
