import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="flex w-full gap-5 lg:h-100">
      <div className="text-primary flex flex-col justify-center gap-11 rounded-xl bg-[#E0F2FE] pl-12.5 lg:w-[60%]">
        <h2 className="text-[48px] font-bold">BACK TO SCHOOL</h2>
        <p className="text-2xl">Build PC thông minh - Nhận quà cực đỉnh</p>
        <Button
          className={cn(
            "hover:bg-primary-hover/90 cursor-pointer rounded-4xl text-xl text-white lg:h-12.5 lg:w-50",
          )}
        >
          Xem ngay
        </Button>
      </div>
      <div className="flex flex-col gap-5 text-2xl font-bold lg:w-[40%]">
        <div className="bg-primary-foreground flex flex-col justify-center rounded-xl pl-7.5 text-white lg:h-47.5">
          RTX 4090 Series
        </div>
        <div className="flex flex-col justify-center rounded-xl bg-[#F3F4F6] pl-7.5 lg:h-47.5">
          Gaming Gear
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
