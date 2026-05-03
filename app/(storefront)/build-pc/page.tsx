"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-toastify";

import { 
  checkCompatibilityRules, 
  evaluateBuildWarnings 
} from "@/features/storefront/build-pc/utils/pc-compatibility";

import {
  BuildPCHeader,
  BuildPartList,
  BuildSummarySidebar,
  ProductPickerModal,
} from "@/features/storefront/build-pc/components";
import {
  type BuildSlotKey,
  type BuildState,
  type ApiProduct,
  type SelectedPart,
} from "@/features/storefront/build-pc/types";
import axiosInstance from "@/lib/axiosInstance";
import { useCart } from "@/features/storefront/cart/context/CartContext";

// Tổng số slot linh kiện (CPU, Mainboard, RAM, VGA, SSD, PSU, Case)
const TOTAL_SLOTS = 7;

export default function BuildPCPage() {
  const { addToCart } = useCart();

  // ─── State ────────────────────────────────────────────────────────────────
  // Linh kiện đã được chọn cho từng slot
  const [selectedParts, setSelectedParts] = useState<BuildState>({});

  // THÊM ĐOẠN NÀY: Tính toán các cảnh báo cho toàn bộ cấu hình hiện tại
  const buildWarnings = useMemo(() => {
    return evaluateBuildWarnings(selectedParts);
  }, [selectedParts]);

  // Cập nhật lại nút Trạng thái tổng (Góc phải trên cùng)
  const hasAnyWarning = Object.keys(buildWarnings).length > 0;

  // Slot nào đang mở modal chọn sản phẩm (null = modal đóng)
  const [openModalFor, setOpenModalFor] = useState<BuildSlotKey | null>(null);

  // Danh sách sản phẩm tải từ API (dùng chung cho tất cả modal)
  const [allProducts, setAllProducts] = useState<ApiProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Trạng thái đang gọi API thêm vào giỏ hàng
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // ─── Tải sản phẩm từ API khi trang mount ─────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoadingProducts(true);
      try {
        const res = await axiosInstance.get<{ products: ApiProduct[] }>(
          "/products?limit=200",
        );
        setAllProducts(res.data.products ?? []);
      } catch {
        toast.error("Không thể tải danh sách linh kiện. Kiểm tra backend!");
      } finally {
        setIsLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  // Người dùng chọn một sản phẩm từ modal → lưu vào slot tương ứng
  const handleSelectPart = useCallback(
    (slot: BuildSlotKey, product: SelectedPart) => {
      setSelectedParts((prev) => ({ ...prev, [slot]: product }));
      setOpenModalFor(null);
      toast.success(`Đã chọn ${product.name}`, { autoClose: 1500 });
    },
    [],
  );

  // Xoá linh kiện khỏi một slot
  const handleRemovePart = useCallback((slot: BuildSlotKey) => {
    setSelectedParts((prev) => {
      const next = { ...prev };
      delete next[slot];
      return next;
    });
  }, []);

  // Làm mới toàn bộ cấu hình
  const handleReset = useCallback(() => {
    setSelectedParts({});
    toast.info("Đã làm mới cấu hình!");
  }, []);

  // ─── Tính tổng giá ────────────────────────────────────────────────────────
  const totalPrice = Object.values(selectedParts).reduce(
    (sum, part) => sum + (part?.price ?? 0),
    0,
  );
  const selectedCount = Object.keys(selectedParts).length;

  // ─── Thêm toàn bộ linh kiện vào giỏ hàng ─────────────────────────────────
  // Dùng CartContext.addToCart() để đảm bảo:
  //   1. Zustand được cập nhật ngay (optimistic UI — cart count tăng liền)
  //   2. API backend được gọi nếu user đã đăng nhập
  //   3. Guest vẫn hoạt động (chỉ lưu local)
  const handleAddToCart = useCallback(async () => {
    const parts = Object.entries(selectedParts) as [BuildSlotKey, SelectedPart][];
    if (parts.length === 0) {
      toast.warning("Vui lòng chọn ít nhất một linh kiện!");
      return;
    }

    setIsAddingToCart(true);
    try {
      // Thêm tuần tự từng linh kiện qua CartContext
      // (tuần tự thay vì song song để tránh race condition trong Zustand)
      for (const [slotKey, part] of parts) {
        await addToCart({
          id: part._id,
          // cartItemId duy nhất = "build-{slot}-{productId}" để tránh duplicate
          cartItemId: `build-${slotKey}-${part._id}`,
          name: part.name,
          price: part.price,
          image: part.image ?? "",
          quantity: 1,
          configName: `Build PC – ${slotKey.toUpperCase()}`,
          sku: `BUILD-${slotKey.toUpperCase()}`,
        });
      }
      toast.success(`Đã thêm ${parts.length} linh kiện vào giỏ hàng!`);
    } catch {
      toast.error("Có lỗi khi thêm vào giỏ hàng. Vui lòng thử lại!");
    } finally {
      setIsAddingToCart(false);
    }
  }, [selectedParts, addToCart]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="container mx-auto max-w-screen-xl px-4">
      {/* Tiêu đề trang */}
      <BuildPCHeader hasWarning={hasAnyWarning} />

      {/* Layout chính: danh sách slot (trái) + sidebar tổng tiền (phải) */}
      <div className="flex flex-col gap-6 pb-16 lg:flex-row lg:items-start">
        {/* Danh sách linh kiện */}
        <div className="min-w-0 flex-1">
          <BuildPartList
            selectedParts={selectedParts}
            //TRUYỀN buildWarnings XUỐNG CHO COMPONENT LIST
            warnings={buildWarnings}
            onSelectSlot={(slot) => setOpenModalFor(slot)}
            onRemoveSlot={handleRemovePart}
          />
        </div>

        {/* Sidebar tổng tiền + nút Thêm vào giỏ */}
        <BuildSummarySidebar
          totalPrice={totalPrice}
          selectedCount={selectedCount}
          totalSlots={TOTAL_SLOTS}
          onAddToCart={handleAddToCart}
          onReset={handleReset}
          isAddingToCart={isAddingToCart}
        />
      </div>

      {/* Modal chọn sản phẩm — chỉ hiện khi có slot đang mở */}
      {openModalFor && (
        <ProductPickerModal
          slotKey={openModalFor}
          products={allProducts}
          isLoading={isLoadingProducts}
          onSelect={(product) => handleSelectPart(openModalFor, product)}
          onClose={() => setOpenModalFor(null)}
        />
      )}
    </div>
  );
}
