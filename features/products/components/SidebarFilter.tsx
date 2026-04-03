"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check, HelpCircle, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarFilterProps {
  categorySlug?: string;
}

const SidebarFilter = ({ categorySlug }: SidebarFilterProps) => {
  // Laptop/PC specific states
  const [activePrice, setActivePrice] = useState("25 - 40 triệu");
  const [activeBrand, setActiveBrand] = useState("DELL");
  const [activeCpu, setActiveCpu] = useState("");
  const [activeRam, setActiveRam] = useState("");

  // CPU specific states
  const [activeCpuBrand, setActiveCpuBrand] = useState("INTEL");
  const [activeCpuPrice, setActiveCpuPrice] = useState("7 - 12 triệu");
  const [activeCpuLine, setActiveCpuLine] = useState("");

  // RAM specific states
  const [activeRamBrand, setActiveRamBrand] = useState("CORSAIR");
  const [activeRamType, setActiveRamType] = useState("DDR5");
  const [activeRamCap, setActiveRamCap] = useState("");

  // Mac specific states
  const [activeMacPrice, setActiveMacPrice] = useState("20 - 30 triệu");
  const [activeMacLine, setActiveMacLine] = useState("MacBook Air");
  const [activeMacChip, setActiveMacChip] = useState("Apple M3");
  const [activeMacRam, setActiveMacRam] = useState("16GB");

  // Mini PC specific states
  const [activeMiniBrand, setActiveMiniBrand] = useState("INTEL NUC");
  const [activeMiniType, setActiveMiniType] = useState("Tất cả");
  const [activeMiniCpu, setActiveMiniCpu] = useState("Apple M Series");

  // VGA specific states
  const [activeVgaBrand, setActiveVgaBrand] = useState("ASUS");
  const [activeVgaGpu, setActiveVgaGpu] = useState("NVIDIA RTX 40 Series");
  const [activeVgaVram, setActiveVgaVram] = useState("");

  // SSD specific states
  const [activeSsdBrand, setActiveSsdBrand] = useState("SAMSUNG");
  const [activeSsdType, setActiveSsdType] = useState("SSD M.2 NVMe");
  const [activeSsdCap, setActiveSsdCap] = useState("");

  // Mainboard specific states
  const [activeMainBrand, setActiveMainBrand] = useState("ASUS");
  const [activeMainSocket, setActiveMainSocket] = useState("Intel LGA 1700");
  const [activeMainChipset, setActiveMainChipset] = useState("");

  // PSU & Case specific states
  const [activePsuType, setActivePsuType] = useState("");
  const [activePsuBrand, setActivePsuBrand] = useState("CORSAIR");
  const [activePsuPower, setActivePsuPower] = useState("600W - 750W");

  if (categorySlug === "cpu") {
    const cpuPrices = [
      "Dưới 3 triệu",
      "3 - 7 triệu",
      "7 - 12 triệu",
      "Trên 12 triệu",
    ];
    const cpuBrands = ["INTEL", "AMD"];
    const cpuLines = [
      "Core i3 / Ryzen 3",
      "Core i5 / Ryzen 5",
      "Core i7 / Ryzen 7",
      "Core i9 / Ryzen 9",
    ];

    return (
      <div className="text-foreground flex w-full shrink-0 flex-col gap-8 pr-4 md:pr-6 lg:w-64">
        {/* THƯƠNG HIỆU */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Thương hiệu
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {cpuBrands.map((brand) => {
              const isActive = activeCpuBrand === brand;
              return (
                <Button
                  variant="outline"
                  key={brand}
                  onClick={() => setActiveCpuBrand(brand)}
                  className={cn(
                    "relative flex h-11 w-full items-center justify-center rounded-md border text-[15px] font-bold tracking-wider uppercase transition-all",
                    isActive
                      ? "border-primary text-primary bg-primary/10"
                      : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground",
                  )}
                >
                  {brand}
                  {isActive && (
                    <span className="text-primary absolute right-2">
                      <Check size={18} strokeWidth={2.5} />
                    </span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* KHOẢNG GIÁ */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Khoảng giá
          </h3>
          <div className="flex flex-col gap-3">
            {cpuPrices.map((price) => {
              const isActive = activeCpuPrice === price;
              return (
                <label
                  key={price}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-[4px] border transition-all",
                      isActive
                        ? "bg-primary border-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                    onClick={() => setActiveCpuPrice(price)}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-primary font-bold"
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                    onClick={() => setActiveCpuPrice(price)}
                  >
                    {price}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* DÒNG CHIP */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Dòng chip
          </h3>
          <div className="flex flex-col gap-3">
            {cpuLines.map((line) => {
              const isActive = activeCpuLine === line;
              return (
                <label
                  key={line}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                  onClick={() => setActiveCpuLine(isActive ? "" : line)}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "bg-primary border-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-primary font-bold"
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                  >
                    {line}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else if (categorySlug === "ram") {
    const ramBrands = ["CORSAIR", "KINGSTON", "G.SKILL", "TEAMGROUP"];
    const ramTypes = ["DDR5", "DDR4"];
    const ramCaps = ["8GB", "16GB", "32GB"];

    return (
      <div className="text-foreground flex w-full shrink-0 flex-col gap-8 pr-4 md:pr-6 lg:w-64">
        {/* THƯƠNG HIỆU */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Thương hiệu
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {ramBrands.map((brand) => {
              const isActive = activeRamBrand === brand;
              return (
                <Button
                  variant="outline"
                  key={brand}
                  onClick={() => setActiveRamBrand(brand)}
                  className={cn(
                    "flex h-11 w-full items-center justify-center rounded-md border text-[14px] font-bold tracking-wider uppercase shadow-none transition-all",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground",
                  )}
                >
                  {brand}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* CHUẨN RAM */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Chuẩn RAM
          </h3>
          <div className="flex flex-col gap-3">
            {ramTypes.map((type) => {
              const isActive = activeRamType === type;
              return (
                <label
                  key={type}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                  onClick={() => setActiveRamType(isActive ? "" : type)}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "border-primary bg-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-primary font-bold"
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                  >
                    {type}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* DUNG LƯỢNG */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Dung lượng
          </h3>
          <div className="flex flex-col gap-3">
            {ramCaps.map((cap) => {
              const isActive = activeRamCap === cap;
              return (
                <label
                  key={cap}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                  onClick={() => setActiveRamCap(isActive ? "" : cap)}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "border-primary bg-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-primary font-bold"
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                  >
                    {cap}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else if (categorySlug === "macbook-imac") {
    const macPrices = [
      "Dưới 20 triệu",
      "20 - 30 triệu",
      "30 - 40 triệu",
      "Trên 40 triệu",
    ];
    const macLines = ["MacBook Air", "MacBook Pro", "iMac", "Mac mini"];
    const macChips = ["Apple M1", "Apple M2", "Apple M3", "Apple M4"];
    const macRams = ["8GB", "16GB", "24GB", "32GB+"];

    return (
      <div className="text-foreground flex w-full shrink-0 flex-col gap-8 pr-4 md:pr-6 lg:w-64">
        {/* DÒNG SẢN PHẨM */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Dòng sản phẩm
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {macLines.map((line) => {
              const isActive = activeMacLine === line;
              return (
                <Button
                  variant="outline"
                  key={line}
                  onClick={() => setActiveMacLine(line)}
                  className={cn(
                    "flex h-10.5 w-full items-center justify-center rounded-md border px-2 text-[13px] font-bold tracking-wider shadow-none transition-all",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground",
                  )}
                >
                  {line}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* KHOẢNG GIÁ */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Khoảng giá
          </h3>
          <div className="flex flex-col gap-3">
            {macPrices.map((price) => (
              <label
                key={price}
                className="group flex cursor-pointer flex-row items-center gap-3"
              >
                <div
                  className={cn(
                    "flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full border transition-all",
                    activeMacPrice === price
                      ? "bg-primary border-primary"
                      : "border-input bg-background group-hover:border-primary/50",
                  )}
                  onClick={() => setActiveMacPrice(price)}
                />
                <span
                  className={cn(
                    "text-[15px] transition-colors select-none",
                    activeMacPrice === price
                      ? "text-primary font-bold"
                      : "text-secondary-foreground group-hover:text-foreground",
                  )}
                  onClick={() => setActiveMacPrice(price)}
                >
                  {price}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* CHIP APPLE (M-SERIES) */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Chip Apple
          </h3>
          <div className="flex flex-col gap-3">
            {macChips.map((chip) => {
              const isActive = activeMacChip === chip;
              return (
                <label
                  key={chip}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                  onClick={() => setActiveMacChip(isActive ? "" : chip)}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "bg-primary border-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-primary font-bold"
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                  >
                    {chip}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* RAM */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Dung lượng RAM
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {macRams.map((ram) => (
              <Button
                variant="outline"
                key={ram}
                onClick={() => setActiveMacRam(ram === activeMacRam ? "" : ram)}
                className={cn(
                  "flex h-10 w-full items-center justify-center rounded-md border text-[14px] font-bold tracking-wider uppercase shadow-none transition-all",
                  activeMacRam === ram
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground",
                )}
              >
                {ram}
              </Button>
            ))}
          </div>
        </div>
      </div>
    );
  } else if (categorySlug === "mini-pc") {
    const miniBrands = ["APPLE", "INTEL NUC", "ASUS", "BEELINK"];
    const miniTypes = [
      "Tất cả",
      "Máy nguyên bộ (Dùng ngay)",
      "Barebone (Tự lắp RAM/Ổ cứng)",
    ];
    const miniCpus = [
      "Intel Core i3 / i5",
      "Intel Core i7",
      "Apple M Series",
      "AMD Ryzen",
    ];

    return (
      <div className="text-foreground flex w-full shrink-0 flex-col gap-8 pr-4 md:pr-6 lg:w-64">
        {/* THƯƠNG HIỆU */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Thương hiệu
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {miniBrands.map((brand) => {
              const isActive = activeMiniBrand === brand;
              return (
                <Button
                  variant="outline"
                  key={brand}
                  onClick={() => setActiveMiniBrand(brand)}
                  className={cn(
                    "flex h-10.5 w-full items-center justify-center rounded-md border px-2 text-[13px] font-bold tracking-wider shadow-none transition-all",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground",
                  )}
                >
                  {brand}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* LOẠI SẢN PHẨM */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-[18px] font-bold tracking-wide">
                Loại sản phẩm
              </h3>
              <HelpCircle className="text-muted-foreground h-4 w-4" />
            </div>
            <ChevronUp className="text-foreground h-5 w-5" />
          </div>
          <div className="flex flex-col gap-3">
            {miniTypes.map((type) => {
              const isActive = activeMiniType === type;
              return (
                <label
                  key={type}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                  onClick={() => setActiveMiniType(isActive ? "" : type)}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "bg-primary border-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-foreground" // Image shows 'Tất cả' as dark text even when active
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                  >
                    {type}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* CPU TÍCH HỢP */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            CPU tích hợp
          </h3>
          <div className="flex flex-col gap-3">
            {miniCpus.map((cpu) => {
              const isActive = activeMiniCpu === cpu;
              return (
                <label
                  key={cpu}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                  onClick={() => setActiveMiniCpu(isActive ? "" : cpu)}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "bg-primary border-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-primary font-bold" // Image shows 'Apple M Series' as blue & bold
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                  >
                    {cpu}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else if (categorySlug === "vga") {
    const vgaBrands = ["ASUS", "GIGABYTE", "MSI", "GALAX"];
    const vgaGpus = [
      "NVIDIA RTX 40 Series",
      "NVIDIA RTX 30 Series",
      "AMD Radeon RX 7000",
      "AMD Radeon RX 6000",
    ];
    const vgaVrams = ["8GB", "12GB", "16GB", "24GB"];

    return (
      <div className="text-foreground flex w-full shrink-0 flex-col gap-8 pr-4 md:pr-6 lg:w-64">
        {/* THƯƠNG HIỆU */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Thương hiệu
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {vgaBrands.map((brand) => {
              const isActive = activeVgaBrand === brand;
              return (
                <Button
                  variant="outline"
                  key={brand}
                  onClick={() => setActiveVgaBrand(brand)}
                  className={cn(
                    "flex h-10.5 w-full items-center justify-center rounded-md border px-2 text-[13px] font-bold tracking-wider shadow-none transition-all",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground",
                  )}
                >
                  {brand}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* CHIP ĐỒ HỌA (GPU) */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Chip đồ họa (GPU)
          </h3>
          <div className="flex flex-col gap-3">
            {vgaGpus.map((gpu) => {
              const isActive = activeVgaGpu === gpu;
              return (
                <label
                  key={gpu}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                  onClick={() => setActiveVgaGpu(isActive ? "" : gpu)}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "bg-primary border-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-primary font-bold"
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                  >
                    {gpu}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* DUNG LƯỢNG VRAM */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Dung lượng VRAM
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {vgaVrams.map((vram) => {
              const isActive = activeVgaVram === vram;
              return (
                <Button
                  variant="outline"
                  key={vram}
                  onClick={() => setActiveVgaVram(isActive ? "" : vram)}
                  className={cn(
                    "flex h-9 w-full items-center justify-center rounded-md border px-1 text-[13px] font-normal shadow-none transition-all",
                    isActive
                      ? "border-primary bg-primary/10 text-primary font-bold"
                      : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground",
                  )}
                >
                  {vram}
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else if (categorySlug === "ssd-hdd") {
    const ssdBrands = ["SAMSUNG", "WD", "KINGSTON", "CRUCIAL"];
    const ssdTypes = ["SSD M.2 NVMe", 'SSD 2.5" SATA III', 'HDD 3.5"'];
    const ssdCaps = ["500GB - 512GB", "1TB", "2TB trở lên"];

    return (
      <div className="text-foreground flex w-full shrink-0 flex-col gap-8 pr-4 md:pr-6 lg:w-64">
        {/* THƯƠNG HIỆU */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Thương hiệu
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {ssdBrands.map((brand) => {
              const isActive = activeSsdBrand === brand;
              return (
                <Button
                  variant="outline"
                  key={brand}
                  onClick={() => setActiveSsdBrand(brand)}
                  className={cn(
                    "flex h-10.5 w-full items-center justify-center rounded-md border px-2 text-[13px] font-bold tracking-wider shadow-none transition-all",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground",
                  )}
                >
                  {brand}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* LOẠI Ổ CỨNG */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Loại ổ cứng
          </h3>
          <div className="flex flex-col gap-3">
            {ssdTypes.map((type) => {
              const isActive = activeSsdType === type;
              return (
                <label
                  key={type}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                  onClick={() => setActiveSsdType(isActive ? "" : type)}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "bg-primary border-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-primary font-bold"
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                  >
                    {type}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* DUNG LƯỢNG */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Dung lượng
          </h3>
          <div className="flex flex-col gap-3">
            {ssdCaps.map((cap) => {
              const isActive = activeSsdCap === cap;
              return (
                <label
                  key={cap}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                  onClick={() => setActiveSsdCap(isActive ? "" : cap)}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "bg-primary border-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-primary font-bold"
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                  >
                    {cap}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else if (categorySlug === "mainboard") {
    const mainBrands = ["ASUS", "GIGABYTE", "MSI", "ASROCK"];
    const mainSockets = ["Intel LGA 1700", "AMD AM5"];
    const mainChipsets = ["Z790 / Z690", "B760 / B660"];

    return (
      <div className="text-foreground flex w-full shrink-0 flex-col gap-8 pr-4 md:pr-6 lg:w-64">
        {/* THƯƠNG HIỆU */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Thương hiệu
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {mainBrands.map((brand) => {
              const isActive = activeMainBrand === brand;
              return (
                <Button
                  variant="outline"
                  key={brand}
                  onClick={() => setActiveMainBrand(brand)}
                  className={cn(
                    "flex h-10.5 w-full items-center justify-center rounded-md border px-2 text-[13px] font-bold tracking-wider shadow-none transition-all",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground",
                  )}
                >
                  {brand}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* SOCKET HỖ TRỢ */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Socket hỗ trợ
          </h3>
          <div className="flex flex-col gap-3">
            {mainSockets.map((socket) => {
              const isActive = activeMainSocket === socket;
              return (
                <label
                  key={socket}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                  onClick={() => setActiveMainSocket(isActive ? "" : socket)}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "bg-primary border-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-primary font-bold"
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                  >
                    {socket}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* CHIPSET */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Chipset
          </h3>
          <div className="flex flex-col gap-3">
            {mainChipsets.map((chipset) => {
              const isActive = activeMainChipset === chipset;
              return (
                <label
                  key={chipset}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                  onClick={() => setActiveMainChipset(isActive ? "" : chipset)}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "bg-primary border-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-primary font-bold"
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                  >
                    {chipset}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  } else if (categorySlug === "psu-case") {
    const psuTypes = ["Nguồn máy tính (PSU)", "Case (Vỏ máy tính)"];
    const psuBrands = ["CORSAIR", "NZXT", "DEEPCOOL", "ASUS"];
    const psuPowers = ["Dưới 600W", "600W - 750W", "850W - 1000W"];

    return (
      <div className="text-foreground flex w-full shrink-0 flex-col gap-8 pr-4 md:pr-6 lg:w-64">
        {/* DANH MỤC */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Danh mục
          </h3>
          <div className="flex flex-col gap-3">
            {psuTypes.map((type) => {
              const isActive = activePsuType === type;
              return (
                <label
                  key={type}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                  onClick={() => setActivePsuType(isActive ? "" : type)}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "bg-primary border-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-primary font-bold"
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                  >
                    {type}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* THƯƠNG HIỆU */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Thương hiệu
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {psuBrands.map((brand) => {
              const isActive = activePsuBrand === brand;
              return (
                <Button
                  variant="outline"
                  key={brand}
                  onClick={() => setActivePsuBrand(brand)}
                  className={cn(
                    "flex h-10.5 w-full items-center justify-center rounded-md border px-2 text-[13px] font-bold tracking-wider shadow-none transition-all",
                    isActive
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground",
                  )}
                >
                  {brand}
                </Button>
              );
            })}
          </div>
        </div>

        <div className="bg-border h-px w-full" />

        {/* CÔNG SUẤT NGUỒN */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[18px] font-bold tracking-wide uppercase">
            Công suất nguồn
          </h3>
          <div className="flex flex-col gap-3">
            {psuPowers.map((power) => {
              const isActive = activePsuPower === power;
              return (
                <label
                  key={power}
                  className="group flex cursor-pointer flex-row items-center gap-3"
                  onClick={() => setActivePsuPower(isActive ? "" : power)}
                >
                  <div
                    className={cn(
                      "flex h-5 w-5 shrink-0 items-center justify-center rounded-lg border transition-all",
                      isActive
                        ? "bg-primary border-primary"
                        : "border-input bg-background group-hover:border-primary/50",
                    )}
                  >
                    {isActive && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[15px] transition-colors select-none",
                      isActive
                        ? "text-primary font-bold"
                        : "text-secondary-foreground group-hover:text-foreground",
                    )}
                  >
                    {power}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // --- DEFAULT (LAPTOP / PC) FILTER ---
  const prices = [
    "Dưới 15 triệu",
    "15 - 25 triệu",
    "25 - 40 triệu",
    "Trên 40 triệu",
  ];
  const brands = ["ASUS", "DELL", "MSI", "LENOVO"];
  const cpus = ["Core i5 / Ryzen 5", "Core i7 / Ryzen 7", "Core i9 / Ryzen 9"];
  const rams = ["8GB", "16GB", "32GB"];

  return (
    <div className="text-foreground flex w-full shrink-0 flex-col gap-8 pr-4 md:pr-6 lg:w-64">
      {/* KHOẢNG GIÁ */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[18px] font-bold tracking-wide uppercase">
          Khoảng giá
        </h3>
        <div className="flex flex-col gap-3">
          {prices.map((price) => (
            <label
              key={price}
              className="group flex cursor-pointer flex-row items-center gap-3"
            >
              <div
                className={cn(
                  "flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full border transition-all",
                  activePrice === price
                    ? "bg-primary border-primary"
                    : "border-input bg-background group-hover:border-primary/50",
                )}
                onClick={() => setActivePrice(price)}
              />
              <span
                className={cn(
                  "text-[15px] transition-colors select-none",
                  activePrice === price
                    ? "text-primary font-bold"
                    : "text-secondary-foreground group-hover:text-foreground",
                )}
                onClick={() => setActivePrice(price)}
              >
                {price}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-border h-px w-full" />

      {/* THƯƠNG HIỆU */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[18px] font-bold tracking-wide uppercase">
          Thương hiệu
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {brands.map((brand) => (
            <Button
              variant="outline"
              key={brand}
              onClick={() => setActiveBrand(brand)}
              className={cn(
                "flex h-10 w-full items-center justify-center rounded-md border text-[14px] font-bold tracking-wider uppercase shadow-none transition-all",
                activeBrand === brand
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground",
              )}
            >
              {brand}
            </Button>
          ))}
        </div>
      </div>

      <div className="bg-border h-px w-full" />

      {/* CPU */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[18px] font-bold tracking-wide uppercase">CPU</h3>
        <div className="flex flex-col gap-3">
          {cpus.map((cpu) => (
            <label
              key={cpu}
              className="group flex cursor-pointer flex-row items-center gap-3"
              onClick={() => setActiveCpu(cpu === activeCpu ? "" : cpu)}
            >
              <div
                className={cn(
                  "flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full border transition-all",
                  activeCpu === cpu
                    ? "border-primary bg-primary"
                    : "border-input bg-background group-hover:border-primary/50",
                )}
              />
              <span
                className={cn(
                  "text-[15px] transition-colors select-none",
                  activeCpu === cpu
                    ? "text-primary font-bold"
                    : "text-secondary-foreground group-hover:text-foreground",
                )}
              >
                {cpu}
              </span>
            </label>
          ))}
        </div>
      </div>

      <div className="bg-border h-px w-full" />

      {/* RAM */}
      <div className="flex flex-col gap-4">
        <h3 className="text-[18px] font-bold tracking-wide uppercase">RAM</h3>
        <div className="grid grid-cols-3 gap-2">
          {rams.map((ram) => (
            <Button
              variant="outline"
              key={ram}
              onClick={() => setActiveRam(ram === activeRam ? "" : ram)}
              className={cn(
                "flex h-10 w-full items-center justify-center rounded-md border text-[14px] font-bold tracking-wider uppercase shadow-none transition-all",
                activeRam === ram
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-background text-muted-foreground hover:border-input hover:text-foreground",
              )}
            >
              {ram}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SidebarFilter;
