"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Slide data ───────────────────────────────────────────────────────────────
// Dùng photo ID đã xác nhận từ seed.ts (không bị 404)

const SLIDES = [
  {
    id: 1,
    badge: "LAPTOP GAMING",
    title: "BACK TO SCHOOL",
    subtitle: "Cấu hình mạnh — Giá sinh viên — Ưu đãi cực đỉnh",
    cta: "Xem ngay",
    href: "/products?category=laptop",
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1400&auto=format&fit=crop",
    gradient: "from-blue-950/80 via-blue-900/50 to-transparent",
  },
  {
    id: 2,
    badge: "CUSTOM PC BUILD",
    title: "THIẾT KẾ PC THEO Ý BẠN",
    subtitle: "Linh kiện chính hãng — Tương thích 100% — Tư vấn AI",
    cta: "Build ngay",
    href: "/build-pc",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1400&auto=format&fit=crop",
    gradient: "from-slate-950/85 via-slate-900/55 to-transparent",
  },
  {
    id: 3,
    badge: "GRAPHICS CARDS",
    title: "RTX 4090 SERIES",
    subtitle: "Chinh phục 4K gaming — Hiệu năng vô song",
    cta: "Khám phá",
    href: "/products?category=vga",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701c6d4d4?q=80&w=1400&auto=format&fit=crop",
    gradient: "from-emerald-950/80 via-emerald-900/50 to-transparent",
  },
] as const;

// ─── Mini banners (right column) ─────────────────────────────────────────────

const MINI_BANNERS = [
  {
    label: "RTX 4090 Series",
    sub: "Flagship GPU 2024",
    image:
      "https://images.unsplash.com/photo-1591488320449-011701c6d4d4?q=80&w=700&auto=format&fit=crop&crop=entropy",
    href: "/products?category=vga",
  },
  {
    label: "Linh Kiện Build PC",
    sub: "Giá tốt nhất thị trường",
    image:
      "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=700&auto=format&fit=crop&crop=top",
    href: "/build-pc",
  },
] as const;

const AUTOPLAY_DELAY = 5000;

// ─── Component ────────────────────────────────────────────────────────────────

const HeroSection = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const prev = useCallback(
    () => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length),
    [],
  );
  const next = useCallback(
    () => setCurrent((c) => (c + 1) % SLIDES.length),
    [],
  );

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, AUTOPLAY_DELAY);
    return () => clearInterval(id);
  }, [next, paused]);

  const slide = SLIDES[current];

  return (
    <section className="flex w-full flex-col gap-4 lg:h-[420px] lg:flex-row">
      {/* ── Main slider ─────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-2xl lg:w-[60%]"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* Background images (pre-rendered, cross-fade) */}
        {SLIDES.map((s, i) => (
          <div
            key={s.id}
            className={cn(
              "absolute inset-0 transition-opacity duration-700",
              i === current ? "opacity-100" : "opacity-0",
            )}
          >
            <Image
              src={s.image}
              alt={s.title}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
        ))}

        {/* Gradient overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-r transition-all duration-700",
            slide.gradient,
          )}
        />

        {/* Content */}
        <div className="relative z-10 flex h-full min-h-[260px] flex-col justify-center gap-4 p-8 lg:min-h-0 lg:gap-5 lg:p-12">
          <span className="w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-bold tracking-widest text-white uppercase backdrop-blur-sm">
            {slide.badge}
          </span>
          <h2 className="text-3xl font-extrabold leading-tight text-white drop-shadow lg:text-[44px]">
            {slide.title}
          </h2>
          <p className="text-sm text-white/85 lg:text-base">{slide.subtitle}</p>
          <Link href={slide.href}>
            <Button className="hover:bg-primary-hover/90 mt-1 h-11 w-40 rounded-full bg-white font-bold text-blue-900 shadow-lg transition-transform hover:scale-105 lg:h-12 lg:w-48 lg:text-base">
              {slide.cta}
            </Button>
          </Link>
        </div>

        {/* Prev / Next arrows */}
        <button
          onClick={prev}
          aria-label="Slide trước"
          className="absolute top-1/2 left-3 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={next}
          aria-label="Slide tiếp"
          className="absolute top-1/2 right-3 z-20 -translate-y-1/2 rounded-full bg-black/30 p-2 text-white backdrop-blur-sm transition hover:bg-black/60"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                i === current
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/80",
              )}
            />
          ))}
        </div>
      </div>

      {/* ── Mini banners (right) ─────────────────────────────────────────── */}
      <div className="flex flex-col gap-4 lg:w-[40%]">
        {MINI_BANNERS.map((b) => (
          <Link
            key={b.label}
            href={b.href}
            className="group relative flex-1 overflow-hidden rounded-2xl"
          >
            <Image
              src={b.image}
              alt={b.label}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 40vw"
            />
            {/* Dark overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/65 to-black/20 transition-opacity duration-300 group-hover:from-black/75" />
            {/* Text */}
            <div className="relative z-10 flex min-h-[120px] flex-col justify-center p-6 lg:min-h-0 lg:h-full">
              <p className="text-lg font-bold text-white drop-shadow lg:text-xl">
                {b.label}
              </p>
              <p className="mt-1 text-sm text-white/75">{b.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
