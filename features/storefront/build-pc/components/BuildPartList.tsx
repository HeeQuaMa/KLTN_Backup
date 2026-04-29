"use client";

import React from "react";
import { BuildPartItem } from "./BuildPartItem";
import { type BuildSlotKey, type BuildState, SLOTS_CONFIG } from "../types";

interface BuildPartListProps {
  selectedParts: BuildState;
  warnings?: Record<string, string[]>;
  onSelectSlot: (slot: BuildSlotKey) => void;
  onRemoveSlot: (slot: BuildSlotKey) => void;
}

export const BuildPartList = ({
  selectedParts,
  warnings = {},
  onSelectSlot,
  onRemoveSlot,
}: BuildPartListProps) => {
  return (
    <div className="flex w-full flex-col gap-4">
      {/* Table Header (Desktop Only) */}
      <div className="hidden h-10.5 w-full items-center justify-between rounded-md bg-heading px-4 shadow-sm md:flex">
        <div className="w-32 shrink-0 text-center text-[13px] font-bold text-white">
          Linh kiện
        </div>
        <div className="flex-1 px-4 text-[13px] font-bold text-white">
          Thông tin sản phẩm
        </div>
        <div className="w-32 shrink-0 pl-16 text-center text-[13px] font-bold text-white">
          Giá thành
        </div>
        <div className="w-16 shrink-0" />
      </div>

      {/* Part Items */}
      <div className="flex flex-col gap-4">
        {SLOTS_CONFIG.map(({ key, label, empty, btn }) => {
          const selected = selectedParts[key];
          return (
            <BuildPartItem
              key={key}
              categoryKey={key}
              categoryLabel={label}
              emptyLabel={empty}
              buttonString={btn}
              slotWarnings={warnings[key]}
              filledData={
                selected
                  ? {
                      id: selected._id,
                      name: selected.name,
                      specs: selected.specs ?? selected.brand ?? "",
                      price: selected.price,
                      image: selected.image,
                      inStock: true,
                    }
                  : undefined
              }
              onSelect={() => onSelectSlot(key)}
              onEdit={() => onSelectSlot(key)}
              onRemove={() => onRemoveSlot(key)}
            />
          );
        })}
      </div>
    </div>
  );
};
