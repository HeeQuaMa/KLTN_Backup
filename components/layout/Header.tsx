import React from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";
function Header() {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 px-4 py-4 transition-all md:px-8 lg:px-12 lg:py-6.25 xl:px-16">
      <div className="text-xl font-bold md:text-2xl lg:text-[32px]">
        <Link href={"/"}>
          <span className="text-primary">Net</span>Tech
        </Link>
      </div>
      <div className="order-last flex h-10 w-full lg:order-0 lg:h-12.5 lg:w-auto">
        <Input
          type="search"
          placeholder="Tìm kiếm linh kiện, Laptop, VGA..."
          className={cn("h-full flex-1 lg:w-150")}
        />
        <Button
          className={cn(
            "hover:bg-primary-hover/90 h-full cursor-pointer px-4 text-white lg:w-17.5",
          )}
        >
          Search
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm md:text-base">
          <ShoppingCart className="h-5 w-5 md:h-6 md:w-6" />
          <p className="hidden md:block">Giỏ hàng</p>
        </div>
        <div className="flex items-center gap-2 lg:h-10">
          <Button
            className={cn(
              "hover:bg-primary-hover/90 h-8 cursor-pointer px-3 text-sm text-white md:h-10 md:px-4 lg:w-30 lg:text-base",
            )}
          >
            Đăng nhập
          </Button>
          <Button
            className={cn(
              "hover:bg-primary-hover/90 h-8 cursor-pointer px-3 text-sm text-white md:h-10 md:px-4 lg:w-30 lg:text-base",
            )}
          >
            Đăng ký
          </Button>
        </div>
      </div>
    </header>
  );
}

export default Header;
