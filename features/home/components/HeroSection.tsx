import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="flex w-full flex-col gap-5 lg:h-100 lg:flex-row">
      <div className="text-primary flex flex-col justify-center gap-6 rounded-xl bg-[#E0F2FE] p-8 lg:w-[60%] lg:gap-11 lg:pl-12.5 text-center lg:text-left items-center lg:items-start">
        <h2 className="text-3xl font-bold lg:text-[48px]">BACK TO SCHOOL</h2>
        <p className="text-lg lg:text-2xl">Build PC thông minh - Nhận quà cực đỉnh</p>
        <Button
          className={cn(
            "hover:bg-primary-hover/90 cursor-pointer rounded-4xl text-base text-white h-11 w-40 lg:h-12.5 lg:w-50 lg:text-xl",
          )}
        >
          Xem ngay
        </Button>
      </div>
      <div className="flex flex-col gap-5 text-xl font-bold lg:w-[40%] lg:text-2xl">
        <div className="bg-primary-foreground flex min-h-[120px] flex-col justify-center rounded-xl pl-8 text-white lg:min-h-0 lg:flex-1 lg:pl-7.5">
          RTX 4090 Series
        </div>
        <div className="flex min-h-[120px] flex-col justify-center rounded-xl bg-[#F3F4F6] pl-8 lg:min-h-0 lg:flex-1 lg:pl-7.5">
          Gaming Gear
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
