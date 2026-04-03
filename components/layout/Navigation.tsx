import React from "react";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Laptop, Cpu } from "lucide-react";

const Navigation = () => {
  return (
    <nav className="bg-primary flex items-center gap-6 overflow-x-auto px-4 py-3 text-sm font-bold whitespace-nowrap text-white uppercase sm:gap-10 md:px-8 lg:h-12.5 lg:gap-20 lg:px-12 lg:py-0 lg:text-base xl:px-16 [&::-webkit-scrollbar]:hidden">
      <HoverCard openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>
          <Link
            href="/products"
            className="cursor-pointer transition-colors hover:text-gray-200"
          >
            Danh mục sản phẩm
          </Link>
        </HoverCardTrigger>
        <HoverCardContent
          className="bg-background border-border mt-2 ml-0 flex max-h-[80vh] w-[calc(100vw-2rem)] flex-col gap-4 overflow-y-auto rounded-xl p-4 shadow-[0px_4px_24px_rgba(0,0,0,0.1)] sm:ml-4 sm:w-auto sm:flex-row sm:gap-8 sm:p-6 md:ml-8 lg:ml-12 xl:ml-16"
          align="start"
          sideOffset={8}
        >
          {/* Cột 1: Laptop & Mac */}
          <div className="border-border flex w-full flex-col gap-3 border-b pb-4 sm:w-70 sm:gap-5 sm:border-r sm:border-b-0 sm:pr-8 sm:pb-0">
            <Link href="/products" className="group flex items-center gap-4">
              <div className="rounded-lg bg-blue-50 p-2.5 transition-colors group-hover:bg-blue-100">
                <Laptop className="h-6 w-6 text-blue-600" />
              </div>
              <span className="group-hover:text-primary text-lg font-bold text-gray-900 normal-case transition-colors">
                Laptop & Mac
              </span>
            </Link>

            <ul className="ml-1 flex flex-col gap-4 text-[16px] font-normal text-gray-600 normal-case">
              <li>
                <Link
                  href="/category/laptop-gaming"
                  className="text-primary hover:text-primary-hover block font-medium transition-colors"
                >
                  Laptop Gaming
                </Link>
              </li>
              <li>
                <Link
                  href="/category/laptop-van-phong"
                  className="hover:text-primary block transition-colors"
                >
                  Laptop Văn phòng
                </Link>
              </li>
              <li>
                <Link
                  href="/category/laptop-do-hoa"
                  className="hover:text-primary block transition-colors"
                >
                  Laptop Đồ họa / Kỹ thuật
                </Link>
              </li>
              <li>
                <Link
                  href="/category/macbook-imac"
                  className="hover:text-primary block transition-colors"
                >
                  MacBook & iMac
                </Link>
              </li>
              <li>
                <Link
                  href="/category/pc-build-san"
                  className="hover:text-primary block transition-colors"
                >
                  Máy tính bộ (PC Build sẵn)
                </Link>
              </li>
              <li>
                <Link
                  href="/category/mini-pc"
                  className="hover:text-primary block transition-colors"
                >
                  Mini PC
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 2: Linh kiện Build PC */}
          <div className="flex w-full flex-col gap-3 pt-2 sm:w-70 sm:gap-5 sm:pt-0">
            <Link href="/build-pc" className="group flex items-center gap-4">
              <div className="rounded-lg bg-blue-50 p-2.5 transition-colors group-hover:bg-blue-100">
                <Cpu className="h-6 w-6 text-blue-600" />
              </div>
              <span className="group-hover:text-primary text-lg font-bold text-gray-900 normal-case transition-colors">
                Linh kiện Build PC
              </span>
            </Link>

            <ul className="ml-1 flex flex-col gap-4 text-[16px] font-normal text-gray-600 normal-case">
              <li>
                <Link
                  href="/category/cpu"
                  className="hover:text-primary block transition-colors"
                >
                  CPU - Bộ vi xử lý
                </Link>
              </li>
              <li>
                <Link
                  href="/category/vga"
                  className="hover:text-primary block transition-colors"
                >
                  VGA - Card màn hình
                </Link>
              </li>
              <li>
                <Link
                  href="/category/mainboard"
                  className="hover:text-primary block transition-colors"
                >
                  Mainboard - Bo mạch chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/category/ram"
                  className="hover:text-primary block transition-colors"
                >
                  RAM - Bộ nhớ trong
                </Link>
              </li>
              <li>
                <Link
                  href="/category/ssd-hdd"
                  className="hover:text-primary block transition-colors"
                >
                  Ổ cứng SSD / HDD
                </Link>
              </li>
              <li>
                <Link
                  href="/category/psu-case"
                  className="hover:text-primary block transition-colors"
                >
                  Nguồn & Case máy tính
                </Link>
              </li>
            </ul>
          </div>
        </HoverCardContent>
      </HoverCard>

      <Link href="/build-pc" className="transition-colors hover:text-gray-200">
        Build PC (AI)
      </Link>
      <Link href="/bao-hanh" className="transition-colors hover:text-gray-200">
        Tra cứu bảo hành
      </Link>
      <Link href="/huong-dan" className="transition-colors hover:text-gray-200">
        Hướng dẫn mua hàng
      </Link>
      <Link
        href="/khuyen-mai"
        className="text-destructive transition-colors hover:text-red-400"
      >
        🔥Khuyến mãi Hot
      </Link>
    </nav>
  );
};

export default Navigation;
