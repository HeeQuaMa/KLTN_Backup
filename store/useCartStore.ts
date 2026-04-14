import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartApi } from "@/features/cart/api/cartApi";
import { useAuthStore } from "./useAuthStore";

export interface CartItem {
  id: string | number;
  cartItemId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  configName?: string;
  sku?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchAndSyncCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      fetchAndSyncCart: async () => {
        const { user, isLoggedIn } = useAuthStore.getState();
        if (isLoggedIn && user?.id) {
          try {
            // Assume API returns direct array `{ data: CartItem[] }` or `CartItem[]`
            const data = await cartApi.getCart(user.id);
            // Handling the case wherever data payload might be wrapped
            const serverItems = Array.isArray(data) ? data : data?.items || [];
            
            set({ items: serverItems });
          } catch (error) {
            console.error("Cart sync failed:", error);
          }
        }
      },

      addItem: async (newItem: CartItem) => {
        // --- 1. OPTIMISTIC UI UPDATE ---
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) => item.cartItemId === newItem.cartItemId
          );
          if (existingItemIndex >= 0) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }
          return { items: [...state.items, newItem] };
        });

        // --- 2. BACKEND SYNC BACKGROUND ---
        const { user, isLoggedIn } = useAuthStore.getState();
        if (isLoggedIn && user?.id) {
          try {
            await cartApi.addToCart({
              userId: user.id,
              productId: newItem.id.toString(),
              cartItemId: newItem.cartItemId,
              name: newItem.name,
              price: newItem.price,
              image: newItem.image,
              quantity: newItem.quantity,
              configName: newItem.configName,
              sku: newItem.sku,
            });
          } catch (e) {
            console.error("Lỗi khi đồng bộ addItem lên máy chủ", e);
            // Optionally: revert state here if failure happens
          }
        }
      },

      removeItem: async (cartItemId: string) => {
        // Optimistic Remove
        set((state) => ({
          items: state.items.filter((item) => item.cartItemId !== cartItemId),
        }));

        const { user, isLoggedIn } = useAuthStore.getState();
        if (isLoggedIn && user?.id) {
          try {
            await cartApi.removeItem(user.id, cartItemId);
          } catch (e) {
            console.error("Lỗi xóa sản phẩm Database", e);
          }
        }
      },

      updateQuantity: async (cartItemId: string, quantity: number) => {
        // Optimistic Update
        const targetQ = Math.max(1, quantity);
        set((state) => ({
          items: state.items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity: targetQ } : item
          ),
        }));

        const { user, isLoggedIn } = useAuthStore.getState();
        if (isLoggedIn && user?.id) {
          try {
            await cartApi.updateQuantity({
              userId: user.id,
              cartItemId,
              quantity: targetQ,
            });
          } catch (e) {
            console.error("Lỗi cập nhật quantity Database", e);
          }
        }
      },

      clearCart: async () => {
        set({ items: [] });
        
        const { user, isLoggedIn } = useAuthStore.getState();
        if (isLoggedIn && user?.id) {
          try {
            await cartApi.clearCart(user.id);
          } catch (e) {
            console.error("Lỗi Clear Cart", e);
          }
        }
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalPrice: () => {
        return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
    }),
    {
      name: "cart-storage", // Cho phép lưu giỏ hàng của khách vô danh local
    }
  )
);
