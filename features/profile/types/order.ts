export type OrderStatus = "pending" | "completed" | "cancelled";

export interface OrderProduct {
  id: string;
  name: string;
  variant: string;
  quantity: number;
  price: number;
  imageUrl: string;
}

export interface OrderData {
  id: string;
  createdAt: string;
  status: OrderStatus;
  totalAmount: number;
  isOTC?: boolean;
  products: OrderProduct[];
}
