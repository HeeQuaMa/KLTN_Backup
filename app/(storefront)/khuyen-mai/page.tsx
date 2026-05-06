"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Copy, Gift, Ticket, Truck } from "lucide-react";

// --- Countdown Component ---
const CountdownTimer = ({ targetDate }: { targetDate: Date }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft("00:00:00");
        return;
      }

      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return <span>{timeLeft}</span>;
};

const PromotionsPage = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Set target date for countdown (e.g., end of today)
  const [targetDate] = useState(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date;
  });

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <main className="px-4 py-4 md:px-8 md:py-6 lg:px-12 xl:px-16 lg:py-7.5">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-3 text-gray-900">
          <Gift className="text-red-500 fill-red-500 w-8 h-8" />
          Săn Deal & Mã Giảm Giá
        </h1>
        <p className="text-sm text-gray-500 mt-2">
          Cập nhật lúc 14:00 - 05/02/2026
        </p>
      </div>

      {/* Hero Banner */}
      <div
        className="relative w-full rounded-2xl p-8 md:p-12 mb-10 overflow-hidden shadow-lg"
        style={{
          backgroundColor: "#0066FF",
          backgroundImage: `
            radial-gradient(circle at 85% -10%, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0) 40%),
            radial-gradient(circle at 95% 110%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 45%),
            radial-gradient(circle at 75% 60%, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0) 30%)
          `,
        }}
      >
        <div className="relative z-10 flex flex-col items-start gap-4 text-white max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            SIÊU SALE LƯƠNG VỀ
          </h2>
          <p className="text-lg md:text-xl text-blue-50">
            Giảm đến 50% Laptop & Gear - Số lượng có hạn!
          </p>
          
          <div className="bg-blue-900/40 backdrop-blur-sm border border-white/10 rounded-full px-4 py-2 mt-2 flex items-center gap-2 text-sm font-medium">
            <span>⏰</span> Kết thúc sau: <CountdownTimer targetDate={targetDate} />
          </div>

          <Button className="mt-4 bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-6 rounded-xl shadow-md transition-transform hover:scale-105">
            SĂN NGAY ▶
          </Button>
        </div>
      </div>

      {/* Filter and Sort */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={() => setActiveFilter("all")}
            className={`rounded-full ${
              activeFilter === "all"
                ? "bg-blue-600 text-white hover:bg-blue-700 border-transparent hover:text-white"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Tất cả
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveFilter("voucher")}
            className={`rounded-full flex items-center gap-2 ${
              activeFilter === "voucher"
                ? "bg-blue-600 text-white hover:bg-blue-700 border-transparent hover:text-white"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Ticket className="w-4 h-4" /> Voucher
          </Button>
          <Button
            variant="outline"
            onClick={() => setActiveFilter("freeship")}
            className={`rounded-full flex items-center gap-2 ${
              activeFilter === "freeship"
                ? "bg-blue-600 text-white hover:bg-blue-700 border-transparent hover:text-white"
                : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
            }`}
          >
            <Truck className="w-4 h-4 text-orange-500" /> Freeship
          </Button>
        </div>

        <div className="w-full sm:w-48">
          <Select defaultValue="newest">
            <SelectTrigger className="w-full bg-white">
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Sắp xếp: Mới nhất</SelectItem>
              <SelectItem value="discount">Giảm nhiều nhất</SelectItem>
              <SelectItem value="ending">Sắp kết thúc</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Card 1: 20% OFF */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="bg-blue-100 p-8 flex flex-col items-center justify-center text-center relative h-48">
            <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-md">
              HOT DEAL
            </span>
            <h3 className="text-4xl font-bold text-blue-900">20% OFF</h3>
          </div>
          <div className="p-6 flex flex-col grow">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Giảm 20% Đơn Đầu Tiên</h4>
            <p className="text-sm text-gray-500 mb-6 line-clamp-2">Tối đa 50k cho khách hàng mới.</p>
            
            <div className="mt-auto">
              <div className="flex items-center justify-between border-2 border-dashed border-gray-200 bg-gray-50 rounded-xl p-3 mb-4">
                <span className="font-bold tracking-wider text-gray-800">CHAOBANMOI</span>
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopy("CHAOBANMOI")}
                  className="text-blue-600 font-bold hover:text-blue-700 hover:bg-blue-50/50"
                >
                  {copiedCode === "CHAOBANMOI" ? "ĐÃ COPY" : "COPY"}
                </Button>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-6 rounded-xl">
                Dùng Ngay
              </Button>
            </div>
          </div>
        </div>

        {/* Card 2: FREESHIP */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="bg-green-100 p-8 flex flex-col items-center justify-center text-center relative h-48">
            <span className="absolute top-4 left-4 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-md">
              TOÀN QUỐC
            </span>
            <h3 className="text-4xl font-bold text-emerald-800">FREESHIP</h3>
          </div>
          <div className="p-6 flex flex-col grow">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Miễn Phí Vận Chuyển</h4>
            <p className="text-sm text-gray-500 mb-6 line-clamp-2">Đơn từ 500k. Áp dụng toàn sàn.</p>
            
            <div className="mt-auto">
              <div className="flex items-center justify-center bg-gray-100 text-gray-500 rounded-xl p-3 mb-4 font-medium text-sm border-2 border-transparent">
                Tự động áp dụng
              </div>
              <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-6 rounded-xl">
                Mua Ngay
              </Button>
            </div>
          </div>
        </div>

        {/* Card 3: MUA 1 TẶNG 1 */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow">
          <div className="bg-pink-100 p-8 flex flex-col items-center justify-center text-center relative h-48">
            <span className="absolute top-4 left-4 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-md">
              QUÀ TẶNG HOT
            </span>
            <h3 className="text-3xl font-bold text-pink-800">MUA 1 TẶNG 1</h3>
          </div>
          <div className="p-6 flex flex-col grow">
            <h4 className="text-lg font-bold text-gray-900 mb-2">Tặng Chuột Gaming</h4>
            <p className="text-sm text-gray-500 mb-6 line-clamp-2">Khi mua Laptop Gaming Asus ROG.</p>
            
            <div className="mt-auto">
              <div className="flex items-center justify-center gap-2 border border-orange-200 bg-orange-50/50 text-orange-600 rounded-xl p-3 mb-4 font-semibold text-sm">
                <Gift className="w-4 h-4" /> Gift: Logitech G102
              </div>
              <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 rounded-xl">
                Xem Sản Phẩm
              </Button>
            </div>
          </div>
        </div>

      </div>
    </main>
  );
};

export default PromotionsPage;
