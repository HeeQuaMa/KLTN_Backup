import React from "react";
import { BuildPCHeader, BuildPartList, BuildSummarySidebar } from "@/features/build-pc/components";

export const metadata = {
  title: "Xây dựng cấu hình máy tính | NetTech",
  description: "Trình xây dựng cấu hình máy tính tự động kiểm tra tương thích",
};

export default function BuildPCPage() {
  return (
    <main className="min-h-screen bg-gray-50/50">
      <div className="mx-auto flex w-full max-w-360 flex-col px-4 md:px-8 lg:px-12 xl:px-16 pb-20">
        <BuildPCHeader />

        <div className="flex flex-col gap-8 lg:flex-row lg:items-start mt-2">
          {/* Left Column: Parts List */}
          <div className="flex-1 w-full">
            <BuildPartList />
          </div>

          {/* Right Column: Checkout Summary sticky sidebar */}
          <BuildSummarySidebar />
        </div>
      </div>
    </main>
  );
}
