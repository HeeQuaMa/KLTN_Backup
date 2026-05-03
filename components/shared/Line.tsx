import React from "react";
import { cn } from "@/lib/utils";

// 1. Giữ lại Interface để component có thể nhận thêm class từ bên ngoài
interface LineProps {
  className?: string;
}

// 2. Sử dụng tham số { className } để tăng tính linh hoạt
const Line = ({ className }: LineProps) => {
  return (
    <hr 
      // 3. Kết hợp: dùng thẻ <hr> (ngữ nghĩa tốt hơn) 
      // và giữ lại style "bg-primary mt-3.5 mb-6.5" đặc trưng của bạn
      className={cn(
        "bg-primary mt-3.5 mb-6.5 lg:h-1 lg:w-25 border-0", 
        className
      )} 
    />
  );
};

export default Line;