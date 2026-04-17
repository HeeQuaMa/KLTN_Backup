"use client";

import React, { useMemo, useState } from "react";
import { ProfileTabs } from "./ProfileTabs";
import { WarrantyItem } from "./WarrantyItem";
import { MOCK_WARRANTIES } from "../utils/mockData";

export const WarrantyList = () => {
  const [activeTabLabel, setActiveTabLabel] = useState<string>("");

  // Dynamically calculate counts and establish exact tab labels
  const allCount = MOCK_WARRANTIES.length;
  const repairingCount = MOCK_WARRANTIES.filter((w) => w.status === "repairing").length;
  const expiredCount = MOCK_WARRANTIES.filter((w) => w.status === "expired").length;

  const TABS_CONFIG = useMemo(() => [
    { key: "all", label: `Tất cả (${allCount})` },
    { key: "repairing", label: `Đang xử lý (${repairingCount})` },
    { key: "expired", label: `Hết hạn (${expiredCount})` },
  ], [allCount, repairingCount, expiredCount]);

  const tabsLabels = TABS_CONFIG.map(t => t.label);

  // Initialize active tab safely
  if (!activeTabLabel && tabsLabels.length > 0) {
    setActiveTabLabel(tabsLabels[0]);
  }

  const activeKey = TABS_CONFIG.find(t => t.label === activeTabLabel)?.key || "all";

  const filteredWarranties = MOCK_WARRANTIES.filter((item) => {
    if (activeKey === "all") return true;
    if (activeKey === "repairing") return item.status === "repairing";
    if (activeKey === "expired") return item.status === "expired";
    return true;
  });

  return (
    <div className="flex w-full flex-col gap-6">
      {/* Page Title & Subtitle */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[24px] font-bold text-heading">Bảo Hành Điện Tử (O2O)</h1>
        <p className="text-[14px] text-gray-500">
          Tra cứu hạn bảo hành và tiến độ sửa chữa tại toàn bộ chi nhánh NetTech.
        </p>
      </div>

      {/* Tabs Generic Instance */}
      <div className="mt-1">
        <ProfileTabs
          tabs={tabsLabels}
          activeTab={activeTabLabel || tabsLabels[0]}
          onChange={setActiveTabLabel}
        />
      </div>

      {/* List Feed */}
      <div className="flex flex-col gap-6">
        {filteredWarranties.length > 0 ? (
          filteredWarranties.map((item) => <WarrantyItem key={item.id} item={item} />)
        ) : (
          <div className="flex h-32 w-full items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-500 shadow-sm">
            Không có dữ liệu bảo hành nào.
          </div>
        )}
      </div>
    </div>
  );
};
