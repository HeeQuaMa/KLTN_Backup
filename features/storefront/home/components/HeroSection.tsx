import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// --- Hero banner background URLs (edit these three) ---
const HERO_BACK_TO_SCHOOL_BG =
  "https://studentcomputers.co.uk/cdn/shop/files/1200x628_back_to_school_laptops.png?v=1692717605";
const HERO_RTX_4090_BG =
  "https://bizweb.dktcdn.net/100/329/122/files/hieu-suat-vuot-troi-cua-rtx-4090.jpg?v=1673115180215";
const HERO_GAMING_GEAR_BG =
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=85";
// -------------------------------------------------------

const HeroSection = () => {
  return (
    <section className="flex w-full flex-col gap-5 lg:h-100 lg:flex-row">
      <div className="relative flex min-h-64 flex-col justify-center overflow-hidden rounded-xl lg:min-h-0 lg:w-[60%]">
        <Image
          src={HERO_BACK_TO_SCHOOL_BG}
          alt=""
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#E0F2FE]/93 via-[#E0F2FE]/82 to-sky-100/72" />
        <div className="relative z-10 flex flex-col items-center justify-center gap-6 p-8 text-center text-primary lg:items-start lg:gap-11 lg:pl-12.5 lg:text-left">
          <h2 className="text-3xl font-bold lg:text-[48px]">BACK TO SCHOOL</h2>
          <p className="text-lg lg:text-2xl">
            Build PC thông minh - Nhận quà cực đỉnh
          </p>
          <Button
            className={cn(
              "hover:bg-primary-hover/90 h-11 w-40 cursor-pointer rounded-4xl text-base text-white lg:h-12.5 lg:w-50 lg:text-xl",
            )}
          >
            Xem ngay
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-5 text-xl font-bold lg:w-[40%] lg:text-2xl">
        <div className="relative flex min-h-30 flex-col justify-center overflow-hidden rounded-xl pl-8 text-white lg:min-h-0 lg:flex-1 lg:pl-7.5">
          <Image
            src={HERO_RTX_4090_BG}
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/25" />
          <span className="relative z-10 drop-shadow-sm">RTX 4090 Series</span>
        </div>
        <div className="relative flex min-h-30 flex-col justify-center overflow-hidden rounded-xl pl-8 lg:min-h-0 lg:flex-1 lg:pl-7.5">
          <Image
            src={HERO_GAMING_GEAR_BG}
            alt=""
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/75 to-white/40" />
          <span className="relative z-10 text-gray-900 drop-shadow-sm">
            Gaming Gear
          </span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
