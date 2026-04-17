import { OrderData } from "../types/order";

export const MOCK_ORDERS: OrderData[] = [
  {
    id: "NT-2026-8892",
    createdAt: "22/01/2026",
    status: "pending",
    totalAmount: 36030000,
    products: [
      {
        id: "p1",
        name: "Asus ROG Strix G16",
        variant: "Core i7 / 16GB / 512GB",
        quantity: 1,
        price: 32990000,
        imageUrl: "",
      },
    ],
  },
  {
    id: "POS-HCM-001",
    createdAt: "10/01/2026",
    status: "completed",
    isOTC: true,
    totalAmount: 390000,
    products: [
      {
        id: "p2",
        name: "Chuột Gaming Logitech G102",
        variant: "Đen / RGB",
        quantity: 1,
        price: 390000,
        imageUrl: "",
      },
    ],
  },
  {
    id: "NT-2025-9981",
    createdAt: "01/01/2026",
    status: "cancelled",
    totalAmount: 1890000,
    products: [
      {
        id: "p3",
        name: "Bàn phím cơ Keychron K2",
        variant: "Red Switch / Nhôm",
        quantity: 1,
        price: 1890000,
        imageUrl: "",
      },
    ],
  },
];

import { WarrantyData } from "../types/warranty";

export const MOCK_WARRANTIES: WarrantyData[] = [
  {
    id: "w1",
    productName: "Laptop Asus ROG Strix G16",
    serial: "G16-8899-2024",
    statusDetail: "Trạm nhận: NetTech Quận 1 (Chờ linh kiện)",
    status: "repairing",
    imageUrl: "",
    hasProgressView: true
  },
  {
    id: "w2",
    productName: "Chuột Gaming Logitech G102",
    serial: "LOGI-G102-1122",
    statusDetail: "Hạn bảo hành: Đến 10/10/2026",
    status: "active",
    imageUrl: "",
    hasProgressView: false
  }
];
