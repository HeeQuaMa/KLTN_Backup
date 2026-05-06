"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { InventoryHeader } from "@/features/super-admin/inventory/components/InventoryHeader";
import { InventorySummary } from "@/features/super-admin/inventory/components/InventorySummary";
import { InventoryFilterBar } from "@/features/super-admin/inventory/components/InventoryFilterBar";
import { InventoryTable } from "@/features/super-admin/inventory/components/InventoryTable";
import {
  fetchAdminInventory,
  postInventoryAudit,
  postInventoryImport,
  type InventoryAdminRow,
  type InventoryAdminStats,
  type InventoryBranch,
} from "@/lib/api/inventoryApi";

export default function SuperAdminInventoryPage() {
  const [branch, setBranch] = useState<InventoryBranch>("all");
  const [searchInput, setSearchInput] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<InventoryAdminStats | null>(null);
  const [rows, setRows] = useState<InventoryAdminRow[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchAdminInventory({
        branch,
        ...(debouncedQ ? { q: debouncedQ } : {}),
      });
      setStats(res.stats);
      setRows(res.rows);
    } catch {
      toast.error(
        "Không tải được dữ liệu kho. Bạn đã đăng nhập quản trị (Super Admin) chưa?",
      );
      setStats(null);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [branch, debouncedQ]);

  useEffect(() => {
    void load();
  }, [load]);

  const onImport = useCallback(() => {
    void (async () => {
      try {
        const r = await postInventoryImport();
        toast.info(r.message);
      } catch {
        toast.error("Không gọi được API nhập kho.");
      }
    })();
  }, []);

  const onAudit = useCallback(() => {
    void (async () => {
      try {
        const r = await postInventoryAudit();
        toast.info(r.message);
      } catch {
        toast.error("Không gọi được API kiểm kê.");
      }
    })();
  }, []);

  return (
    <div className="flex flex-col gap-6 p-8">
      <InventoryHeader onImport={onImport} onAudit={onAudit} />
      <InventorySummary stats={stats} loading={loading} />
      <InventoryFilterBar
        branch={branch}
        onBranchChange={setBranch}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />
      <InventoryTable rows={rows} loading={loading} />
    </div>
  );
}
