import React from "react";
import { CheckCircle2 } from "lucide-react";

export const BuildPCHeader = () => {
  return (
    <div className="flex flex-col gap-4 py-8 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold uppercase text-foreground mb-2">
          Xây dựng cấu hình PC
        </h1>
        <p className="text-muted-foreground text-[15px]">
          Công cụ được hỗ trợ bởi AI - Tự động kiểm tra tính tương thích 100%.
        </p>
      </div>

      <div className="flex h-12 items-center gap-2 rounded-full border-2 border-green-500 bg-white px-6 shadow-sm max-w-max shrink-0">
        <CheckCircle2 className="h-6 w-6 fill-green-500 text-white" strokeWidth={1} />
        <span className="font-bold text-green-600">Hệ thống tương thích tốt</span>
      </div>
    </div>
  );
};
