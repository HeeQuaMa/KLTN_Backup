"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown, Laptop, Cpu } from "lucide-react";
import http from "@/lib/axiosInstance";

interface Category {
  _id: string;
  name: string;
  slug?: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const PC_KEYWORDS = [
  "cpu", "mainboard", "bo mạch", "ram", "gpu", "card màn", "vga",
  "psu", "nguồn", "case", "vỏ", "cooler", "tản nhiệt", "ssd", "nvme", "ổ cứng",
];

const isPCComponent = (name: string) =>
  PC_KEYWORDS.some((kw) => name.toLowerCase().includes(kw));

/**
 * Enriches a raw DB category name with a Vietnamese description.
 * Only adds the suffix when the name doesn't already contain " - ".
 * DB names like "CPU" → "CPU - Bộ vi xử lý"
 * DB names already like "VGA - Card màn hình" → left as-is.
 */
function getDisplayName(name: string): string {
  if (name.includes(" - ") || name.includes("/")) return name; // already descriptive

  const l = name.toLowerCase();
  if (l === "cpu")                        return "CPU - Bộ vi xử lý";
  if (l === "gpu" || l === "vga")         return "VGA - Card màn hình";
  if (l === "ram")                        return "RAM - Bộ nhớ trong";
  if (l === "ssd")                        return "Ổ cứng SSD / HDD";
  if (l === "psu")                        return "Nguồn máy tính (PSU)";
  if (l === "case")                       return "Vỏ Case máy tính";
  if (l === "cooler")                     return "Tản nhiệt CPU";
  if (l.includes("mainboard"))            return "Mainboard - Bo mạch chủ";
  if (l.includes("card màn") || l.includes("gpu") || l.includes("vga"))
                                          return "VGA - Card màn hình";
  if (l.includes("nguồn"))               return "Nguồn máy tính (PSU)";
  if (l.includes("tản nhiệt"))           return "Tản nhiệt CPU";
  if (l.includes("ổ cứng") || l.includes("nvme")) return "Ổ cứng SSD / HDD";
  if (l.includes("vỏ") || l.includes("case"))     return "Vỏ Case máy tính";
  return name;
}

/**
 * Full static laptop list — always shown in the left column.
 * Matches the reference design exactly.
 */
const LAPTOP_ITEMS = [
  { label: "Laptop Gaming",              href: "/products?category=laptop-gaming" },
  { label: "Laptop Văn phòng",           href: "/products?category=laptop-van-phong" },
  { label: "Laptop Đồ họa / Kỹ thuật",  href: "/products?category=laptop-do-hoa" },
  { label: "MacBook & iMac",             href: "/products?category=macbook" },
  { label: "Máy tính bộ (PC Build sẵn)", href: "/products?category=may-tinh-bo" },
  { label: "Mini PC",                    href: "/products?category=mini-pc" },
];

// ── Component ─────────────────────────────────────────────────────────────────

const Navigation = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);
  const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    http
      .get<Category[]>("/categories")
      .then((res) => setCategories(res.data ?? []))
      .catch(() => setCategories([]));
  }, []);

  // Only use DB categories for the PC components column
  const pcCategories = categories.filter((c) => isPCComponent(c.name));

  const open  = () => { if (hideTimer.current) clearTimeout(hideTimer.current); setMenuOpen(true); };
  const close = () => { hideTimer.current = setTimeout(() => setMenuOpen(false), 150); };

  return (
    /*
     * Z-INDEX / OVERFLOW NOTE (do not revert)
     * ────────────────────────────────────────
     * CSS spec forces overflow-y → auto when overflow-x is auto.
     * The dropdown MUST be a direct child of <nav> (NOT inside the
     * overflow-x-auto inner div) so it is never clipped.
     */
    <nav className="bg-primary relative z-10 text-sm font-bold text-white uppercase lg:text-base">

      {/* Scrollable nav bar row */}
      <div className="flex items-center gap-6 overflow-x-auto whitespace-nowrap px-4 py-3 sm:gap-10 md:px-8 lg:px-12 xl:px-16 lg:h-12.5 lg:gap-20 lg:py-0 [&::-webkit-scrollbar]:hidden">
        <button
          onMouseEnter={open}
          onMouseLeave={close}
          className="flex shrink-0 items-center gap-1.5 transition-colors hover:text-gray-200 focus:outline-none"
          aria-expanded={menuOpen}
          aria-haspopup="true"
        >
          DANH MỤC SẢN PHẨM
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`} />
        </button>

        <Link href="/build-pc"   className="shrink-0 transition-colors hover:text-gray-200">Build PC (AI)</Link>
        <Link href="/bao-hanh"   className="shrink-0 transition-colors hover:text-gray-200">Tra cứu bảo hành</Link>
        <Link href="/huong-dan"  className="shrink-0 transition-colors hover:text-gray-200">Hướng dẫn mua hàng</Link>
        <Link href="/khuyen-mai" className="text-destructive shrink-0 transition-colors hover:text-red-400">🔥 Khuyến mãi Hot</Link>
      </div>

      {/* ── Mega-menu dropdown ────────────────────────────────────────────────
          Direct child of <nav> — never clipped by the overflow row above.
          `normal-case` resets the nav's `uppercase` so item text is readable.
      ── */}
      {menuOpen && (
        <div
          onMouseEnter={open}
          onMouseLeave={close}
          className="absolute left-0 top-full z-[9999] w-[660px] rounded-b-2xl border border-t-0 border-gray-100 bg-white normal-case shadow-2xl"
        >
          <div className="grid grid-cols-2 divide-x divide-gray-100">

            {/* ── Left column: Laptop & Mac ── */}
            <div className="px-8 py-7">
              {/* Heading */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Laptop className="h-5 w-5 text-primary" strokeWidth={1.75} />
                </div>
                <span className="text-[15px] font-bold tracking-normal text-gray-900">
                  Laptop &amp; Mac
                </span>
              </div>

              {/* Items — plain text, color-only hover, no icons */}
              <ul className="flex flex-col gap-0">
                {LAPTOP_ITEMS.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className="block py-[9px] text-[15px] font-normal tracking-normal text-gray-600 transition-colors hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* ── Right column: Linh kiện Build PC ── */}
            <div className="px-8 py-7">
              {/* Heading */}
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Cpu className="h-5 w-5 text-primary" strokeWidth={1.75} />
                </div>
                <span className="text-[15px] font-bold tracking-normal text-gray-900">
                  Linh kiện Build PC
                </span>
              </div>

              {/* Items — SINGLE column so long names never wrap.
                  Use slug in URL (stable) — backend resolves slug → ObjectId. */}
              <ul className="flex flex-col gap-0">
                {pcCategories.map((cat) => (
                  <li key={cat._id}>
                    <Link
                      href={`/products?category=${cat.slug ?? cat._id}`}
                      onClick={() => setMenuOpen(false)}
                      className="block py-[9px] text-[15px] font-normal tracking-normal text-gray-600 transition-colors hover:text-primary"
                    >
                      {getDisplayName(cat.name)}
                    </Link>
                  </li>
                ))}
                {pcCategories.length === 0 && (
                  <li className="py-4 text-sm text-gray-400">Đang tải danh mục…</li>
                )}
              </ul>
            </div>
          </div>

          {/* Footer — separated by top border, aligned with column padding */}
          <div className="grid grid-cols-2 divide-x divide-gray-100 border-t border-gray-100">
            <div className="px-8 py-4">
              <Link
                href="/products"
                onClick={() => setMenuOpen(false)}
                className="text-primary text-sm font-semibold tracking-normal transition-colors hover:underline"
              >
                Xem tất cả sản phẩm →
              </Link>
            </div>
            <div className="px-8 py-4">
              <Link
                href="/build-pc"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-semibold tracking-normal text-gray-500 transition-colors hover:text-primary hover:underline"
              >
                Build PC →
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
