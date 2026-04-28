"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreateVoucherModal } from "./CreateVoucherModal";

export function PromotionHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-center justify-between pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800">
          Quản lý Chương trình Khuyến mãi
        </h1>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-[#111827] hover:bg-slate-800 text-white font-medium rounded-full px-6"
        >
          <Plus className="mr-2 h-4 w-4" />
          Tạo Voucher
        </Button>
      </div>

      <CreateVoucherModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
