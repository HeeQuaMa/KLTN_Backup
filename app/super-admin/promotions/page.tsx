"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { PromotionHeader } from "@/features/super-admin/promotions/components/PromotionHeader";
import { PromotionSummary } from "@/features/super-admin/promotions/components/PromotionSummary";
import { PromotionFilterBar } from "@/features/super-admin/promotions/components/PromotionFilterBar";
import { PromotionTable } from "@/features/super-admin/promotions/components/PromotionTable";

export default function SuperAdminPromotionsPage() {
  const [promotions, setPromotions] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Hàm gọi API lấy danh sách khuyến mãi
  const fetchPromotions = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3001/promotions");
      setPromotions(res.data);
    } catch (error) {
      console.error("Lỗi lấy danh sách khuyến mãi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromotions();
  }, []);

  // Lọc dữ liệu dựa trên ô tìm kiếm
  const filteredPromotions = promotions.filter((promo) => 
    promo.code.toLowerCase().includes(search.toLowerCase()) || 
    promo.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Truyền hàm fetchPromotions để Modal gọi lại sau khi tạo thành công */}
      <PromotionHeader refreshData={fetchPromotions} />
      
      {/* Truyền list gốc để Summary tính toán */}
      <PromotionSummary promotions={promotions} />
      
      {/* Truyền state search để thanh tìm kiếm hoạt động */}
      <PromotionFilterBar search={search} setSearch={setSearch} />
      
      {/* Truyền list đã lọc để hiển thị lên bảng */}
      <PromotionTable promotions={filteredPromotions} loading={loading} />
    </div>
  );
}