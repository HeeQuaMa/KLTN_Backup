import React from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface BuildPCHeaderProps {
  hasWarning?: boolean;
}

export const BuildPCHeader = ({ hasWarning = false }: BuildPCHeaderProps ) => {
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

      {/* 👉 2. Dùng điều kiện để đổi màu và text */}
      <div className="mt-4 md:mt-0">
        {hasWarning ? (
          <div className="flex items-center gap-2 px-4 py-2 bg-orange-50 border border-orange-200 rounded-full text-orange-600 font-medium text-[14px]">
            <AlertTriangle className="w-5 h-5" />
            <span>Cấu hình có cảnh báo</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full text-green-600 font-medium text-[14px]">
            <CheckCircle2 className="w-5 h-5" />
            <span>Hệ thống tương thích tốt</span>
          </div>
        )}
      </div>
    </div>
  );
};
