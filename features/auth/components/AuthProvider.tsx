// features/auth/components/AuthProvider.tsx
"use client";

import React from "react";
import { useInitializeAuth } from "../hooks/useInitializeAuth";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // Gọi hook ở đây để nó tự động chạy khi web tải lên
  useInitializeAuth();

  // Trả về toàn bộ giao diện con (không làm ảnh hưởng đến UI)
  return <>{children}</>;
}