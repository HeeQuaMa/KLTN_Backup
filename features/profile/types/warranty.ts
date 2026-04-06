export type WarrantyStatus = "repairing" | "active" | "expired";

export interface WarrantyData {
  id: string; // The physical or logical item identifier, not the DB constraint ID
  productName: string;
  serial: string;
  statusDetail: string; // e.g: "Trạm nhận: NetTech Quận 1 (Chờ linh kiện)" or "Hạn bảo hành: Đến 10/10/2026"
  status: WarrantyStatus;
  imageUrl: string;
  hasProgressView?: boolean;
}
