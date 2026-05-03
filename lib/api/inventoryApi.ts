import axiosInstance from "@/lib/axiosInstance";

export type InventoryBranch = "all" | "q5" | "q1" | "q10";

export interface InventoryAdminStats {
  totalSkus: number;
  lowStockCount: number;
  inventoryValue: number;
}

export interface InventoryAdminRow {
  _id: string;
  sku: string;
  name: string;
  categoryName: string;
  totalStock: number;
  stockBreakdown: string;
  importPrice: number;
  sellPrice: number;
  status: "Sẵn hàng" | "Hết hàng";
}

export interface InventoryAdminResponse {
  stats: InventoryAdminStats;
  rows: InventoryAdminRow[];
}

export async function fetchAdminInventory(params: {
  branch: InventoryBranch;
  q?: string;
}): Promise<InventoryAdminResponse> {
  const { data } = await axiosInstance.get<InventoryAdminResponse>("/inventory/admin", {
    params: {
      branch: params.branch,
      ...(params.q ? { q: params.q } : {}),
    },
  });
  return data;
}

export async function postInventoryImport(): Promise<{ ok: boolean; message: string }> {
  const { data } = await axiosInstance.post<{ ok: boolean; message: string }>(
    "/inventory/import",
  );
  return data;
}

export async function postInventoryAudit(): Promise<{ ok: boolean; message: string }> {
  const { data } = await axiosInstance.post<{ ok: boolean; message: string }>(
    "/inventory/audit",
  );
  return data;
}
