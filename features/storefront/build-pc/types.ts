// Các slot linh kiện trong cấu hình Build PC
export type BuildSlotKey =
  | "cpu"
  | "mainboard"
  | "ram"
  | "vga"
  | "ssd"
  | "psu"
  | "case";

// Thông tin sản phẩm trả về từ API backend
// specifications dùng Record linh hoạt để chứa cả string lẫn number (tdp, wattage, ...)
export interface ApiProduct {
  _id: string;
  name: string;
  price: number;
  brand: string;
  specifications?: Record<string, string | number | boolean | string[] | null | undefined>;
  images?: string[];
  totalStock: number;
  description?: string;
  sku?: string;
}

// Thông tin linh kiện đã được chọn vào slot
export interface SelectedPart {
  _id: string;
  name: string;
  price: number;
  image?: string;
  specs?: string;
  brand?: string;
  specifications?: Record<string, any>;
}

// Trạng thái toàn bộ bộ Build (mỗi slot có thể có hoặc không có linh kiện)
export type BuildState = Partial<Record<BuildSlotKey, SelectedPart>>;

// Config label + placeholder cho mỗi slot
export interface SlotConfig {
  key: BuildSlotKey;
  label: string;
  empty: string;
  btn: string;
  // Từ khóa để lọc sản phẩm liên quan trong modal
  keywords: string[];
}

export const SLOTS_CONFIG: SlotConfig[] = [
  {
    key: "cpu",
    label: "CPU",
    empty: "Vui lòng chọn CPU",
    btn: "CHỌN CPU",
    keywords: ["cpu", "core i", "ryzen", "processor", "xeon"],
  },
  {
    key: "mainboard",
    label: "Mainboard",
    empty: "Vui lòng chọn Bo mạch chủ",
    btn: "CHỌN MAINBOARD",
    keywords: ["mainboard", "bo mạch", "z790", "b760", "x570", "b550", "h610", "h670", "z690"],
  },
  {
    key: "ram",
    label: "RAM",
    empty: "Vui lòng chọn RAM",
    btn: "CHỌN RAM",
    keywords: ["ram", "ddr4", "ddr5", "memory", "bộ nhớ", "dimm"],
  },
  {
    key: "vga",
    label: "VGA",
    empty: "Vui lòng chọn Card màn hình",
    btn: "CHỌN VGA",
    keywords: ["rtx", "rx ", "gtx", "gpu", "vga", "geforce", "radeon", "arc"],
  },
  {
    key: "ssd",
    label: "SSD",
    empty: "Vui lòng chọn Ổ cứng",
    btn: "CHỌN SSD",
    keywords: ["ssd", "nvme", "m.2", "hdd", "ổ cứng", "hard drive"],
  },
  {
    key: "psu",
    label: "PSU",
    empty: "Vui lòng chọn Nguồn máy tính",
    btn: "CHỌN PSU",
    keywords: ["psu", "nguồn", "power supply", "watt", "evga", "corsair rm", "seasonic"],
  },
  {
    key: "case",
    label: "Case",
    empty: "Vui lòng chọn Vỏ máy",
    btn: "CHỌN CASE",
    keywords: ["case", "vỏ máy", "tower", "chassis", "nzxt", "lian li"],
  },
];
