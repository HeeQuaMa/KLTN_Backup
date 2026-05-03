"use client";

import React, { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Search, Check, PackageX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type BuildSlotKey,
  type ApiProduct,
  type SelectedPart,
  SLOTS_CONFIG,
} from "../types";

interface ProductPickerModalProps {
  slotKey: BuildSlotKey;
  products: ApiProduct[];
  isLoading: boolean;
  onSelect: (part: SelectedPart) => void;
  onClose: () => void;
}

// ─── Price formatter ──────────────────────────────────────────────────────────

const vnd = new Intl.NumberFormat("vi-VN");

function formatPrice(price: number | undefined | null): string {
  if (price == null || isNaN(price)) return "—";
  return `${vnd.format(price)}đ`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const ProductPickerModal = ({
  slotKey,
  products,
  isLoading,
  onSelect,
  onClose,
}: ProductPickerModalProps) => {
  const [search, setSearch] = useState("");

  // ── Portal mount guard (document not available on SSR) ─────────────────────
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    // Lock body scroll while modal is open
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const slotConfig = SLOTS_CONFIG.find((s) => s.key === slotKey)!;

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (q) {
      return products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.sku?.toLowerCase().includes(q),
      );
    }
    return products.filter((p) =>
      slotConfig.keywords.some((kw) => p.name.toLowerCase().includes(kw)),
    );
  }, [products, search, slotConfig.keywords]);

  const handleSelect = (p: ApiProduct) => {
    const specs = p.specifications
      ? Object.entries(p.specifications)
          .slice(0, 3)
          .map(([, v]) => `${v}`)
          .join(" | ")
      : p.brand || "";

    onSelect({
      _id: p._id,
      name: p.name,
      price: p.price ?? 0,
      image: p.images?.[0] ?? "",
      specs: specs || p.brand || "",
      brand: p.brand,
      specifications: p.specifications,
    });
  };

  // ── Modal JSX ─────────────────────────────────────────────────────────────
  const modal = (
    /*
     * STACKING FIX:
     * Rendered via createPortal → direct child of document.body.
     * z-[9999] ensures it beats the header band (z-[100] in SiteLayout)
     * and the nav dropdown (z-[9999] inside its own stacking context).
     */
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="flex h-[88vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
        // Stop clicks inside the card from bubbling to the backdrop
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-heading flex shrink-0 items-center justify-between px-5 py-4">
          <div>
            <h2 className="text-[16px] font-bold text-white">
              Chọn {slotConfig.label}
            </h2>
            <p className="mt-0.5 text-[12px] text-white/70">
              {filtered.length} sản phẩm phù hợp
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-colors hover:bg-white/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Search bar */}
        <div className="shrink-0 border-b border-gray-100 p-4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              className="h-10 pl-9 text-[14px]"
              placeholder={`Tìm tên, thương hiệu ${slotConfig.label}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        {/* Product list */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="flex flex-col gap-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex animate-pulse items-center gap-4 rounded-xl border border-gray-100 p-3"
                >
                  <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-3/4 rounded bg-gray-200" />
                    <div className="h-3 w-1/2 rounded bg-gray-200" />
                    <div className="h-4 w-1/3 rounded bg-gray-200" />
                  </div>
                  <div className="h-9 w-16 shrink-0 rounded-lg bg-gray-200" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <PackageX className="h-12 w-12 text-gray-300" />
              <p className="font-semibold text-gray-500">
                Không tìm thấy sản phẩm
              </p>
              <p className="text-sm text-gray-400">
                {search
                  ? `Không có kết quả cho "${search}"`
                  : `Chưa có ${slotConfig.label} trong kho. Thử tìm kiếm với từ khoá khác.`}
              </p>
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="text-primary text-sm font-medium hover:underline"
                >
                  Xem tất cả sản phẩm
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((p) => (
                <div
                  key={p._id}
                  className="group hover:border-primary/40 flex items-center gap-4 rounded-xl border border-gray-100 bg-white p-3 transition-all hover:shadow-sm"
                >
                  {/* Thumbnail */}
                  <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
                    {p.images?.[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={p.images[0]}
                        alt={p.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          // Hide broken image, show fallback
                          (e.currentTarget as HTMLImageElement).style.display =
                            "none";
                          const parent = (e.currentTarget as HTMLImageElement)
                            .parentElement;
                          if (parent) {
                            parent.innerHTML =
                              '<div class="flex h-full w-full items-center justify-center text-[10px] text-gray-300 font-medium">No img</div>';
                          }
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-gray-300">
                        No img
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="min-w-0 flex-1">
                    <p className="group-hover:text-primary line-clamp-1 text-[14px] font-bold text-gray-900 transition-colors">
                      {p.name}
                    </p>
                    {p.brand && (
                      <p className="mt-0.5 text-[12px] text-gray-400">
                        {p.brand}
                      </p>
                    )}
                    <div className="mt-1.5 flex items-center gap-3">
                      {/* Price — guarded against NaN/undefined */}
                      <span className="text-[14px] font-bold text-red-500">
                        {formatPrice(p.price)}
                      </span>
                      {/* Stock badge */}
                      {(p.totalStock ?? 0) > 0 ? (
                        <span className="flex items-center gap-0.5 text-[11px] font-semibold text-green-600">
                          <Check className="h-3 w-3" strokeWidth={3} />
                          Còn hàng
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold text-red-400">
                          Hết hàng
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Select button */}
                  <Button
                    onClick={() => handleSelect(p)}
                    disabled={(p.totalStock ?? 0) <= 0}
                    size="sm"
                    className="h-9 shrink-0 px-4 text-[13px] font-bold"
                  >
                    Chọn
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div className="shrink-0 border-t border-gray-100 px-5 py-3">
          <p className="text-center text-[12px] text-gray-400">
            Nhấn bên ngoài hoặc ✕ để đóng
          </p>
        </div>
      </div>
    </div>
  );

  // Only render the portal after the component mounts on the client
  if (!mounted) return null;
  return createPortal(modal, document.body);
};
