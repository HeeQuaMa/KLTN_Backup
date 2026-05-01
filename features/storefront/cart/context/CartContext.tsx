"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore, CartItem } from "@/store/useCartStore";
import { cartApi, mapApiItemToCartItem } from "@/lib/api/cartApi";
import { isValidMongoId } from "@/lib/utils";

interface CartContextValue {
  items: CartItem[];
  totalQuantity: number;
  totalPrice: number;
  isLoading: boolean;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const { isLoggedIn, user } = useAuthStore();
  const userId: string | undefined = user?._id ?? user?.id;

  const store = useCartStore();

  // ── Fetch giỏ hàng từ API khi user đăng nhập ──────────────────────────────
  useEffect(() => {
    if (!isLoggedIn || !userId) return;

    setIsLoading(true);
    cartApi
      .getCart(userId)
      .then((cart) => {
        if (cart.items?.length > 0) {
          useCartStore.setState({ items: cart.items.map(mapApiItemToCartItem) });
        }
      })
      .catch(() => {
        // Backend chưa khởi động → giữ nguyên Zustand local
      })
      .finally(() => setIsLoading(false));
  }, [isLoggedIn, userId]);

  // ── Thêm sản phẩm (optimistic: cập nhật Zustand ngay, gọi API ngầm) ───────
  const addToCart = useCallback(
    async (item: CartItem) => {
      // Luôn cập nhật local state trước (optimistic UI)
      store.addItem(item);

      // Chỉ sync lên API khi user đã đăng nhập VÀ product có ID MongoDB hợp lệ
      if (!userId || !isValidMongoId(item.id)) return;

      try {
        await cartApi.addToCart({
          userId,
          productId: String(item.id),
          cartItemId: item.cartItemId,
          name: item.name,
          price: item.price,
          image: typeof item.image === "string" ? item.image : "",
          quantity: item.quantity,
          configName: item.configName,
          sku: item.sku,
        });
      } catch {
        // Silent fail — local cart vẫn hoạt động
      }
    },
    [store, userId],
  );

  // ── Xóa 1 sản phẩm ────────────────────────────────────────────────────────
  const removeFromCart = useCallback(
    async (cartItemId: string) => {
      store.removeItem(cartItemId);

      if (!userId) return;

      // Tìm item trong store để lấy productId rồi kiểm tra
      const item = useCartStore.getState().items.find((i) => i.cartItemId === cartItemId);
      if (!isValidMongoId(item?.id)) return;

      try {
        await cartApi.removeItem(userId, cartItemId);
      } catch {
        // Silent fail
      }
    },
    [store, userId],
  );

  // ── Cập nhật số lượng ─────────────────────────────────────────────────────
  const updateQuantity = useCallback(
    async (cartItemId: string, quantity: number) => {
      if (quantity < 1) {
        return removeFromCart(cartItemId);
      }
      store.updateQuantity(cartItemId, quantity);

      if (!userId) return;

      // Chỉ gọi API nếu item đó là sản phẩm real (không phải mock)
      const item = useCartStore.getState().items.find((i) => i.cartItemId === cartItemId);
      if (!isValidMongoId(item?.id)) return;

      try {
        await cartApi.updateQuantity({ userId, cartItemId, quantity });
      } catch {
        // Silent fail
      }
    },
    [store, userId, removeFromCart],
  );

  // ── Xóa toàn bộ giỏ ──────────────────────────────────────────────────────
  const clearCart = useCallback(async () => {
    store.clearCart();

    if (!userId) return;
    try {
      await cartApi.clearCart(userId);
    } catch {
      // Silent fail
    }
  }, [store, userId]);

  // ── Computed values ────────────────────────────────────────────────────────
  const totalQuantity = useMemo(() => store.getTotalItems(), [store]);
  const totalPrice = useMemo(() => store.getTotalPrice(), [store]);

  const value = useMemo<CartContextValue>(
    () => ({
      items: store.items,
      totalQuantity,
      totalPrice,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [
      store.items,
      totalQuantity,
      totalPrice,
      isLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

/** Hook để dùng cart context trong bất kỳ component nào */
export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart phải được dùng bên trong <CartProvider>");
  return ctx;
}
