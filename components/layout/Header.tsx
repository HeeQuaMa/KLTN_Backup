import React from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
function Header() {
  return (
    <header className="flex items-center justify-between px-15 py-6.25">
      <div className="text-sm font-bold md:text-base lg:text-[32px]">
        <span className="text-primary">Net</span>Tech
      </div>
      <div className="lg:h-12.5">
        <Input
          type="search"
          placeholder="Tìm kiếm linh kiện, Laptop, VGA..."
          className={cn("h-full lg:w-150")}
        />
        <Button
          className={cn(
            "hover:bg-primary-hover/90 h-full cursor-pointer text-white lg:w-17.5",
          )}
        >
          Search
        </Button>
      </div>

      <div className="flex items-center justify-between gap-2 text-base">
        <ShoppingCart />
        <p>Giỏ hàng</p>
      </div>
      <div className="flex items-center justify-between gap-2 lg:h-10">
        <Button
          className={cn(
            "hover:bg-primary-hover/90 h-full cursor-pointer text-base text-white lg:w-30",
          )}
        >
          Đăng nhập
        </Button>
        <Button
          className={cn(
            "hover:bg-primary-hover/90 h-full cursor-pointer text-base text-white lg:w-30",
          )}
        >
          Đăng ký
        </Button>
      </div>
    </header>
  );
}

export default Header;
