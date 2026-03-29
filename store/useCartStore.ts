import { create } from "zustand";
import { DetailedProduct, ProductConfig } from "@/features/products/utils/mockProductDetail";
import { ProductType } from "@/components/shared/ProductCard";

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
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  
  addItem: (newItem: CartItem) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) => item.cartItemId === newItem.cartItemId
      );

      // Nếu món hàng + đúng cấu hình đó đã có trong giỏ -> Tăng số lượng
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return { items: updatedItems };
      }

      // Nếu chưa có -> Thêm mới vào
      return { items: [...state.items, newItem] };
    });
  },

  removeItem: (cartItemId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.cartItemId !== cartItemId),
    }));
  },

  updateQuantity: (cartItemId: string, quantity: number) => {
    set((state) => ({
      items: state.items.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: Math.max(1, quantity) } : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    return get().items.reduce((total, item) => total + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((total, item) => total + item.price * item.quantity, 0);
  },
}));
