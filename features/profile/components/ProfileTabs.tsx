"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ProfileTabsProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onChange: (tab: T) => void;
}

export function ProfileTabs<T extends string>({ tabs, activeTab, onChange }: ProfileTabsProps<T>) {
  return (
    <div className="w-full flex h-14 overflow-x-auto overflow-y-hidden rounded-xl border border-gray-100 bg-[#FAFAFA] px-2 shadow-sm hide-scrollbar">
      <div className="flex w-fit items-center h-full min-w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onChange(tab)}
              className={cn(
                "relative flex h-full items-center justify-center whitespace-nowrap px-6 text-[14px] font-bold transition-colors",
                isActive ? "text-primary" : "text-gray-500 hover:text-heading"
              )}
            >
              {tab}
              {isActive && (
                <div className="absolute bottom-0 left-0 h-[2px] w-full bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
