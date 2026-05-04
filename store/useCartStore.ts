import { create } from "zustand";
import { persist } from "zustand/middleware";
import { cartApi } from "@/features/storefront/cart/api/cartApi";
import { useAuthStore } from "./useAuthStore";

export interface CartItem {
  id: string | number; // ID gốc của sản phẩm
  cartItemId: string; // ID phân biệt (id + config) trong giỏ

  name: string;
  price: number;
  image: string;
  quantity: number;
  configName?: string;
  sku?: string;
}

interface CartStore {
  items: CartItem[];
  // --- MỚI THÊM CHO VOUCHER ---
  appliedVoucher: string | null;
  discountAmount: number;
  
  addItem: (item: CartItem) => Promise<void>;
  removeItem: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchAndSyncCart: () => Promise<void>;
  
  // --- HÀM XỬ LÝ VOUCHER ---
  setVoucher: (code: string, amount: number) => void;
  resetVoucher: () => void;
  
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      // Khởi tạo giá trị mặc định cho Voucher
      appliedVoucher: null,
      discountAmount: 0,

      // Hàm gán Voucher khi nhập thành công
      setVoucher: (code, amount) => set({ appliedVoucher: code, discountAmount: amount }),
      
      // Hàm xoá Voucher (dùng khi thanh toán xong hoặc đổi ý)
      resetVoucher: () => set({ appliedVoucher: null, discountAmount: 0 }),

      fetchAndSyncCart: async () => {
        const { user, isLoggedIn } = useAuthStore.getState();
        if (isLoggedIn && user?.id) {
          try {
            const data = await cartApi.getCart(user.id);
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
          }
        }
      },

      removeItem: async (cartItemId: string) => {
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
        // Khi clearCart (VD: thanh toán thành công), tiện tay reset luôn voucher
        set({ items: [], appliedVoucher: null, discountAmount: 0 });
        
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
      name: "cart-storage", // Zustand sẽ tự lưu cả Voucher vào localStorage dưới key này
    }
  )
);