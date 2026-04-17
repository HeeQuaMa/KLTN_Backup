import mockAvt from "@/public/images/pink.jpg";

export interface Product {
  id: string | number;
  name: string;
  specs: string;
  price: number;
  originalPrice: number | null;
  discount: string | null;
  image: any;
  categorySlug: string;
  sku?: string;
  totalStock?: number;
  
  // Dynamic filter fields matching SidebarFilter
  brand?: string;
  
  // Laptop/PC specific
  demand?: string; // Gaming, Văn phòng...
  
  // CPU
  cpuLine?: string; // Core i5 / Ryzen 5
  
  // RAM
  ramType?: string; // DDR5, DDR4
  ramCapacity?: string; // 8GB, 16GB
  
  // Mac
  macLine?: string; // MacBook Air, MacBook Pro, iMac
  macChip?: string; // Apple M2...
  
  // Mini PC
  miniType?: string; // Barebone, Máy nguyên bộ
  
  // VGA
  gpu?: string; // NVIDIA RTX 40 Series
  vram?: string; // 8GB, 12GB
  
  // SSD/HDD
  storageType?: string; // SSD M.2 NVMe, HDD 3.5"
  storageCapacity?: string; // 500GB - 512GB, 1TB
  
  // Mainboard
  socket?: string; // Intel LGA 1700, AMD AM5
  chipset?: string; // Z790 / Z690
  
  // PSU & Case
  psuType?: string; // Nguồn máy tính (PSU) hay Case
  psuPower?: string; // 600W - 750W
}

export const mockProducts: Product[] = [
  // ==========================================
  // LAPTOP GAMING (categorySlug: "laptop-gaming")
  // ==========================================
  {
    id: "lap-gam-1", name: "ASUS ROG Zephyrus G14", specs: "Ryzen 9 / RTX 4060", price: 38500000, originalPrice: 42000000, discount: "-8%", image: mockAvt, categorySlug: "laptop-gaming", brand: "ASUS", demand: "Gaming",
  },
  {
    id: "lap-gam-2", name: "MSI Katana 15", specs: "Core i7 / RTX 4050", price: 25990000, originalPrice: 29000000, discount: "-10%", image: mockAvt, categorySlug: "laptop-gaming", brand: "MSI", demand: "Gaming",
  },
  {
    id: "lap-gam-3", name: "Acer Predator Helios Neo 16", specs: "Core i9 / RTX 4070", price: 41000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "laptop-gaming", brand: "ACER", demand: "Gaming",
  },
  {
    id: "lap-gam-4", name: "HP Victus 16", specs: "Ryzen 7 / RTX 4060", price: 26500000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "laptop-gaming", brand: "HP", demand: "Gaming",
  },
  {
    id: "lap-gam-5", name: "Lenovo Legion Pro 5", specs: "Ryzen 7 / RTX 4060", price: 35000000, originalPrice: 38000000, discount: "-8%", image: mockAvt, categorySlug: "laptop-gaming", brand: "LENOVO", demand: "Gaming",
  },
  {
    id: "lap-gam-6", name: "Gigabyte G15", specs: "Core i5 / RTX 4050", price: 22000000, originalPrice: 24000000, discount: "-8%", image: mockAvt, categorySlug: "laptop-gaming", brand: "GIGABYTE", demand: "Gaming",
  },
  {
    id: "lap-gam-7", name: "Dell Alienware M16", specs: "RTX 4070 / 32GB", price: 45000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "laptop-gaming", brand: "DELL", demand: "Gaming",
  },
  {
    id: "lap-gam-8", name: "Asus TUF Gaming F15", specs: "Core i7 / RTX 4060", price: 28990000, originalPrice: 31000000, discount: "-6%", image: mockAvt, categorySlug: "laptop-gaming", brand: "ASUS", demand: "Gaming",
  },

  // ==========================================
  // LAPTOP VĂN PHÒNG (categorySlug: "laptop-van-phong")
  // ==========================================
  {
    id: "lap-vp-1", name: "Dell XPS 13 Plus", specs: "Core i7 / 16GB / 512GB", price: 35990000, originalPrice: 40000000, discount: "-10%", image: mockAvt, categorySlug: "laptop-van-phong", brand: "DELL", demand: "Văn phòng",
  },
  {
    id: "lap-vp-2", name: "Dell Inspiron 16", specs: "Core i5 / 8GB / 512GB", price: 18500000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "laptop-van-phong", brand: "DELL", demand: "Văn phòng",
  },
  {
    id: "lap-vp-3", name: "ThinkPad X1 Carbon Gen 11", specs: "Core i7 / 32GB / 1TB", price: 52000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "laptop-van-phong", brand: "LENOVO", demand: "Văn phòng",
  },
  {
    id: "lap-vp-4", name: "ASUS Zenbook 14 OLED", specs: "Core i5 / 16GB / 512GB", price: 23990000, originalPrice: 26000000, discount: "-8%", image: mockAvt, categorySlug: "laptop-van-phong", brand: "ASUS", demand: "Văn phòng",
  },
  {
    id: "lap-vp-5", name: "HP Envy x360", specs: "Ryzen 5 / 8GB / 512GB", price: 19500000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "laptop-van-phong", brand: "HP", demand: "Văn phòng",
  },
  {
    id: "lap-vp-6", name: "Acer Swift 3", specs: "Core i5 / 16GB / 512GB", price: 17000000, originalPrice: 19000000, discount: "-11%", image: mockAvt, categorySlug: "laptop-van-phong", brand: "ACER", demand: "Văn phòng",
  },
  {
    id: "lap-vp-7", name: "LG Gram 14", specs: "Core i7 / 16GB / 512GB", price: 31000000, originalPrice: 34000000, discount: "-9%", image: mockAvt, categorySlug: "laptop-van-phong", brand: "LG", demand: "Văn phòng",
  },
  {
    id: "lap-vp-8", name: "Lenovo IdeaPad Slim 5", specs: "Ryzen 7 / 16GB / 512GB", price: 16500000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "laptop-van-phong", brand: "LENOVO", demand: "Văn phòng",
  },

  // ==========================================
  // LAPTOP ĐỒ HỌA (categorySlug: "laptop-do-hoa")
  // ==========================================
  {
    id: "lap-dh-1", name: "Dell Precision 5570", specs: "Core i7 / 32GB / RTX A1000", price: 55000000, originalPrice: 60000000, discount: "-8%", image: mockAvt, categorySlug: "laptop-do-hoa", brand: "DELL", demand: "Đồ họa",
  },
  {
    id: "lap-dh-2", name: "ASUS ProArt Studiobook", specs: "Core i9 / RTX 4070 / 64GB", price: 79000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "laptop-do-hoa", brand: "ASUS", demand: "Đồ họa",
  },
  {
    id: "lap-dh-3", name: "Lenovo ThinkPad P16", specs: "Core i7 / RTX A2000", price: 62000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "laptop-do-hoa", brand: "LENOVO", demand: "Đồ họa",
  },
  {
    id: "lap-dh-4", name: "HP ZBook Studio G9", specs: "Core i9 / RTX 3070Ti", price: 68000000, originalPrice: 72000000, discount: "-5%", image: mockAvt, categorySlug: "laptop-do-hoa", brand: "HP", demand: "Đồ họa",
  },
  {
    id: "lap-dh-5", name: "Acer ConceptD 7 Ezel", specs: "Core i7 / RTX 3080", price: 71000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "laptop-do-hoa", brand: "ACER", demand: "Đồ họa",
  },
  {
    id: "lap-dh-6", name: "MSI Creator Z16", specs: "Core i9 / RTX 4060", price: 54000000, originalPrice: 58000000, discount: "-7%", image: mockAvt, categorySlug: "laptop-do-hoa", brand: "MSI", demand: "Đồ họa",
  },
  {
    id: "lap-dh-7", name: "Dell XPS 15 9530", specs: "Core i7 / 32GB / RTX 4050", price: 49000000, originalPrice: 52000000, discount: "-6%", image: mockAvt, categorySlug: "laptop-do-hoa", brand: "DELL", demand: "Đồ họa",
  },
  {
    id: "lap-dh-8", name: "Gigabyte Aero 16 OLED", specs: "Core i7 / RTX 4070", price: 51000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "laptop-do-hoa", brand: "GIGABYTE", demand: "Đồ họa",
  },

  // ==========================================
  // MACBOOK & IMAC (categorySlug: "macbook-imac")
  // Filters: macLine, macChip, ramCapacity
  // ==========================================
  {
    id: "mac-1", name: "MacBook Air M1 13-inch", specs: "M1 / 8GB / 256GB", price: 18500000, originalPrice: 20000000, discount: "-7%", image: mockAvt, categorySlug: "macbook-imac", brand: "APPLE", macLine: "MacBook Air", macChip: "Apple M1", ramCapacity: "8GB",
  },
  {
    id: "mac-2", name: "MacBook Air M2 13-inch", specs: "Apple M2 / 8GB / 256GB", price: 24000000, originalPrice: 28000000, discount: "-14%", image: mockAvt, categorySlug: "macbook-imac", brand: "APPLE", macLine: "MacBook Air", macChip: "Apple M2", ramCapacity: "8GB",
  },
  {
    id: "mac-3", name: "MacBook Air M3 15-inch", specs: "M3 / 16GB / 512GB", price: 34500000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "macbook-imac", brand: "APPLE", macLine: "MacBook Air", macChip: "Apple M3", ramCapacity: "16GB",
  },
  {
    id: "mac-4", name: "MacBook Pro M2 13-inch", specs: "M2 / 8GB / 256GB", price: 28000000, originalPrice: 30000000, discount: "-6%", image: mockAvt, categorySlug: "macbook-imac", brand: "APPLE", macLine: "MacBook Pro", macChip: "Apple M2", ramCapacity: "8GB",
  },
  {
    id: "mac-5", name: "MacBook Pro M3 Pro 14-inch", specs: "M3 Pro / 18GB / 512GB", price: 49000000, originalPrice: 52000000, discount: "-5%", image: mockAvt, categorySlug: "macbook-imac", brand: "APPLE", macLine: "MacBook Pro", macChip: "Apple M3", ramCapacity: "24GB", // Mapped logically
  },
  {
    id: "mac-6", name: "MacBook Pro M3 Max 16-inch", specs: "M3 Max / 36GB / 1TB", price: 85000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "macbook-imac", brand: "APPLE", macLine: "MacBook Pro", macChip: "Apple M3", ramCapacity: "32GB+",
  },
  {
    id: "mac-7", name: "iMac 24-inch M3", specs: "M3 / 8GB / 256GB / Pink", price: 36000000, originalPrice: 38000000, discount: "-5%", image: mockAvt, categorySlug: "macbook-imac", brand: "APPLE", macLine: "iMac", macChip: "Apple M3", ramCapacity: "8GB",
  },
  {
    id: "mac-8", name: "Mac mini M2 Pro", specs: "M2 Pro / 16GB / 512GB", price: 34000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "macbook-imac", brand: "APPLE", macLine: "Mac mini", macChip: "Apple M2", ramCapacity: "16GB",
  },

  // ==========================================
  // MÁY TÍNH BỘ (categorySlug: "pc-build-san")
  // ==========================================
  {
    id: "pc-1", name: "PC Đồ Họa Master", specs: "Core i7 / 32GB / RTX 4070", price: 42000000, originalPrice: 45000000, discount: "-6%", image: mockAvt, categorySlug: "pc-build-san", brand: "CUSTOM", demand: "Đồ họa",
  },
  {
    id: "pc-2", name: "PC Gaming Pro X", specs: "Ryzen 5 / 16GB / RTX 4060", price: 23000000, originalPrice: 25000000, discount: "-8%", image: mockAvt, categorySlug: "pc-build-san", brand: "CUSTOM", demand: "Gaming",
  },
  {
    id: "pc-3", name: "PC Văn Phòng Dell Optiplex", specs: "Core i5 / 8GB / 512GB", price: 12000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "pc-build-san", brand: "DELL", demand: "Văn phòng",
  },
  {
    id: "pc-4", name: "PC Lenovo ThinkCentre", specs: "Core i3 / 8GB / 256GB", price: 90000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "pc-build-san", brand: "LENOVO", demand: "Văn phòng",
  },
  {
    id: "pc-5", name: "PC HP Pavilion", specs: "Core i7 / 16GB / 1TB", price: 19500000, originalPrice: 22000000, discount: "-11%", image: mockAvt, categorySlug: "pc-build-san", brand: "HP", demand: "Làm việc",
  },
  {
    id: "pc-6", name: "PC Gaming Entry", specs: "Core i3 / 16GB / GTX 1650", price: 11000000, originalPrice: 12500000, discount: "-12%", image: mockAvt, categorySlug: "pc-build-san", brand: "CUSTOM", demand: "Gaming",
  },
  {
    id: "pc-7", name: "PC ASUS ROG Strix", specs: "Ryzen 7 / 32GB / RTX 4070Ti", price: 55000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "pc-build-san", brand: "ASUS", demand: "Gaming",
  },
  {
    id: "pc-8", name: "PC Acer Predator Orion", specs: "Core i9 / 64GB / RTX 4090", price: 110000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "pc-build-san", brand: "ACER", demand: "Gaming",
  },

  // ==========================================
  // MINI PC (categorySlug: "mini-pc")
  // Filters: miniBrand, miniType, miniCpu
  // ==========================================
  {
    id: "mini-1", name: "Mac Studio M2 Max", specs: "M2 Max / 32GB / 512GB", price: 55000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "mini-pc", brand: "APPLE", miniType: "Máy nguyên bộ (Dùng ngay)", cpuLine: "Apple M Series",
  },
  {
    id: "mini-2", name: "Intel NUC 13 Pro", specs: "Core i5 / Barebone", price: 12000000, originalPrice: 13500000, discount: "-11%", image: mockAvt, categorySlug: "mini-pc", brand: "INTEL NUC", miniType: "Barebone (Tự lắp RAM/Ổ cứng)", cpuLine: "Intel Core i3 / i5",
  },
  {
    id: "mini-3", name: "Intel NUC 12 Extreme", specs: "Core i7 / Barebone", price: 29000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "mini-pc", brand: "INTEL NUC", miniType: "Barebone (Tự lắp RAM/Ổ cứng)", cpuLine: "Intel Core i7",
  },
  {
    id: "mini-4", name: "Apple Mac mini M2", specs: "M2 / 8GB / 256GB", price: 14500000, originalPrice: 15500000, discount: "-6%", image: mockAvt, categorySlug: "mini-pc", brand: "APPLE", miniType: "Máy nguyên bộ (Dùng ngay)", cpuLine: "Apple M Series",
  },
  {
    id: "mini-5", name: "ASUS Mini PC PN51", specs: "Ryzen 5 / 8GB / 256GB", price: 95000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "mini-pc", brand: "ASUS", miniType: "Máy nguyên bộ (Dùng ngay)", cpuLine: "AMD Ryzen",
  },
  {
    id: "mini-6", name: "ASUS ExpertCenter PB62", specs: "Core i7 / Barebone", price: 16000000, originalPrice: 18000000, discount: "-11%", image: mockAvt, categorySlug: "mini-pc", brand: "ASUS", miniType: "Barebone (Tự lắp RAM/Ổ cứng)", cpuLine: "Intel Core i7",
  },
  {
    id: "mini-7", name: "Beelink SER5 Pro", specs: "Ryzen 7 / 16GB / 500GB", price: 8500000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "mini-pc", brand: "BEELINK", miniType: "Máy nguyên bộ (Dùng ngay)", cpuLine: "AMD Ryzen",
  },
  {
    id: "mini-8", name: "Beelink U59 Pro", specs: "Intel N5105 / 8GB / 256GB", price: 4500000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "mini-pc", brand: "BEELINK", miniType: "Máy nguyên bộ (Dùng ngay)", cpuLine: "Intel Core i3 / i5", // close enough
  },

  // ==========================================
  // CPU (categorySlug: "cpu")
  // Filters: brand, cpuLine
  // ==========================================
  {
    id: "cpu-1", name: "Intel Core i3-12100F", specs: "4 Nhân / 8 Luồng / 4.3GHz", price: 2150000, originalPrice: 2500000, discount: "-14%", image: mockAvt, categorySlug: "cpu", brand: "INTEL", cpuLine: "Core i3 / Ryzen 3",
  },
  {
    id: "cpu-2", name: "Intel Core i5-13400F", specs: "10 Nhân / 16 Luồng / 4.6GHz", price: 5400000, originalPrice: 5800000, discount: "-7%", image: mockAvt, categorySlug: "cpu", brand: "INTEL", cpuLine: "Core i5 / Ryzen 5",
  },
  {
    id: "cpu-3", name: "Intel Core i7-13700K", specs: "16 Nhân / 24 Luồng / 5.4GHz", price: 9800000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "cpu", brand: "INTEL", cpuLine: "Core i7 / Ryzen 7",
  },
  {
    id: "cpu-4", name: "Intel Core i9-14900K", specs: "24 Nhân / 32 Luồng / 6.0GHz", price: 15500000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "cpu", brand: "INTEL", cpuLine: "Core i9 / Ryzen 9",
  },
  {
    id: "cpu-5", name: "AMD Ryzen 5 7600", specs: "6 Nhân / 12 Luồng / 5.1GHz", price: 5300000, originalPrice: 5600000, discount: "-5%", image: mockAvt, categorySlug: "cpu", brand: "AMD", cpuLine: "Core i5 / Ryzen 5",
  },
  {
    id: "cpu-6", name: "AMD Ryzen 7 7800X3D", specs: "8 Nhân / 16 Luồng / 5.0GHz", price: 10500000, originalPrice: 11000000, discount: "-4%", image: mockAvt, categorySlug: "cpu", brand: "AMD", cpuLine: "Core i7 / Ryzen 7",
  },
  {
    id: "cpu-7", name: "AMD Ryzen 9 7950X", specs: "16 Nhân / 32 Luồng / 5.7GHz", price: 14800000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "cpu", brand: "AMD", cpuLine: "Core i9 / Ryzen 9",
  },
  {
    id: "cpu-8", name: "AMD Ryzen 3 4100", specs: "4 Nhân / 8 Luồng / 4.0GHz", price: 1500000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "cpu", brand: "AMD", cpuLine: "Core i3 / Ryzen 3",
  },

  // ==========================================
  // VGA (categorySlug: "vga")
  // Filters: brand, gpu, vram
  // ==========================================
  {
    id: "vga-1", name: "ASUS Dual GeForce RTX 4060", specs: "8GB / GDDR6 / 128-bit", price: 8500000, originalPrice: 9000000, discount: "-5%", image: mockAvt, categorySlug: "vga", brand: "ASUS", gpu: "NVIDIA RTX 40 Series", vram: "8GB",
  },
  {
    id: "vga-2", name: "GIGABYTE GeForce RTX 3060 Windforce", specs: "12GB / GDDR6", price: 7200000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "vga", brand: "GIGABYTE", gpu: "NVIDIA RTX 30 Series", vram: "12GB",
  },
  {
    id: "vga-3", name: "MSI GeForce RTX 4070 Ti SUPER", specs: "16GB / GDDR6X", price: 23500000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "vga", brand: "MSI", gpu: "NVIDIA RTX 40 Series", vram: "16GB",
  },
  {
    id: "vga-4", name: "ASUS TUF Gaming Radeon RX 7800 XT", specs: "16GB / GDDR6", price: 14500000, originalPrice: 15000000, discount: "-3%", image: mockAvt, categorySlug: "vga", brand: "ASUS", gpu: "AMD Radeon RX 7000", vram: "16GB",
  },
  {
    id: "vga-5", name: "GIGABYTE Radeon RX 6600 Eagle", specs: "8GB / GDDR6", price: 5400000, originalPrice: 5800000, discount: "-7%", image: mockAvt, categorySlug: "vga", brand: "GIGABYTE", gpu: "AMD Radeon RX 6000", vram: "8GB",
  },
  {
    id: "vga-6", name: "GALAX GeForce RTX 4090 SG", specs: "24GB / GDDR6X", price: 56000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "vga", brand: "GALAX", gpu: "NVIDIA RTX 40 Series", vram: "24GB",
  },
  {
    id: "vga-7", name: "MSI GeForce RTX 3050 Ventus 2X", specs: "8GB / GDDR6", price: 4800000, originalPrice: 5200000, discount: "-7%", image: mockAvt, categorySlug: "vga", brand: "MSI", gpu: "NVIDIA RTX 30 Series", vram: "8GB",
  },
  {
    id: "vga-8", name: "ASUS ROG Strix RTX 4080 SUPER", specs: "16GB / GDDR6X", price: 34000000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "vga", brand: "ASUS", gpu: "NVIDIA RTX 40 Series", vram: "16GB",
  },

  // ==========================================
  // MAINBOARD (categorySlug: "mainboard")
  // Filters: brand, socket, chipset
  // ==========================================
  {
    id: "main-1", name: "ASUS PRIME Z790-P", specs: "Socket 1700 / ATX / 4xDDR5", price: 5200000, originalPrice: 5500000, discount: "-5%", image: mockAvt, categorySlug: "mainboard", brand: "ASUS", socket: "Intel LGA 1700", chipset: "Z790 / Z690",
  },
  {
    id: "main-2", name: "MSI PRO B760M-P", specs: "Socket 1700 / mATX / 4xDDR4", price: 2800000, originalPrice: 3000000, discount: "-6%", image: mockAvt, categorySlug: "mainboard", brand: "MSI", socket: "Intel LGA 1700", chipset: "B760 / B660",
  },
  {
    id: "main-3", name: "GIGABYTE X670 AORUS ELITE AX", specs: "Socket AM5 / ATX / DDR5", price: 7900000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "mainboard", brand: "GIGABYTE", socket: "AMD AM5", chipset: "Khác",
  },
  {
    id: "main-4", name: "ASROCK B650M Pro RS", specs: "Socket AM5 / mATX / DDR5", price: 3400000, originalPrice: 3800000, discount: "-10%", image: mockAvt, categorySlug: "mainboard", brand: "ASROCK", socket: "AMD AM5", chipset: "Khác",
  },
  {
    id: "main-5", name: "ASUS ROG STRIX Z790-F GAMING", specs: "Socket 1700 / ATX / Wifi", price: 10500000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "mainboard", brand: "ASUS", socket: "Intel LGA 1700", chipset: "Z790 / Z690",
  },
  {
    id: "main-6", name: "ASROCK B760M Steel Legend", specs: "Socket 1700 / mATX", price: 4200000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "mainboard", brand: "ASROCK", socket: "Intel LGA 1700", chipset: "B760 / B660",
  },
  {
    id: "main-7", name: "MSI MEG Z690 UNIFY", specs: "Socket 1700 / ATX / DDR5", price: 12500000, originalPrice: 13500000, discount: "-7%", image: mockAvt, categorySlug: "mainboard", brand: "MSI", socket: "Intel LGA 1700", chipset: "Z790 / Z690",
  },
  {
    id: "main-8", name: "GIGABYTE B650 AORUS ELITE", specs: "Socket AM5 / DDR5", price: 5500000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "mainboard", brand: "GIGABYTE", socket: "AMD AM5", chipset: "Khác",
  },

  // ==========================================
  // RAM (categorySlug: "ram")
  // Filters: brand, ramType, ramCapacity
  // ==========================================
  {
    id: "ram-1", name: "Corsair Vengeance RGB 32GB", specs: "DDR5 / 6000MHz", price: 3400000, originalPrice: 3800000, discount: "-10%", image: mockAvt, categorySlug: "ram", brand: "CORSAIR", ramType: "DDR5", ramCapacity: "32GB",
  },
  {
    id: "ram-2", name: "Kingston FURY Beast 16GB", specs: "DDR4 / 3200MHz", price: 950000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "ram", brand: "KINGSTON", ramType: "DDR4", ramCapacity: "16GB",
  },
  {
    id: "ram-3", name: "G.SKILL Trident Z5 Neo 32GB", specs: "DDR5 / 6000MHz", price: 3600000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "ram", brand: "G.SKILL", ramType: "DDR5", ramCapacity: "32GB",
  },
  {
    id: "ram-4", name: "TEAMGROUP T-Force Delta 16GB", specs: "DDR5 / 5600MHz", price: 1750000, originalPrice: 1950000, discount: "-10%", image: mockAvt, categorySlug: "ram", brand: "TEAMGROUP", ramType: "DDR5", ramCapacity: "16GB",
  },
  {
    id: "ram-5", name: "Corsair Vengeance LPX 8GB", specs: "DDR4 / 3200MHz", price: 450000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "ram", brand: "CORSAIR", ramType: "DDR4", ramCapacity: "8GB",
  },
  {
    id: "ram-6", name: "Kingston FURY Impact 32GB", specs: "DDR5 / 4800MHz / SO-DIMM", price: 2600000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "ram", brand: "KINGSTON", ramType: "DDR5", ramCapacity: "32GB",
  },
  {
    id: "ram-7", name: "G.SKILL Ripjaws V 16GB", specs: "DDR4 / 3600MHz", price: 1100000, originalPrice: 1250000, discount: "-12%", image: mockAvt, categorySlug: "ram", brand: "G.SKILL", ramType: "DDR4", ramCapacity: "16GB",
  },
  {
    id: "ram-8", name: "TEAMGROUP T-Create Expert 32GB", specs: "DDR5 / 6400MHz", price: 2900000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "ram", brand: "TEAMGROUP", ramType: "DDR5", ramCapacity: "32GB",
  },

  // ==========================================
  // SSD / HDD (categorySlug: "ssd-hdd")
  // Filters: brand, storageType, storageCapacity
  // ==========================================
  {
    id: "ssd-1", name: "Samsung 980 PRO 1TB", specs: "PCIe 4.0 NVMe", price: 2400000, originalPrice: 2800000, discount: "-14%", image: mockAvt, categorySlug: "ssd-hdd", brand: "SAMSUNG", storageType: "SSD M.2 NVMe", storageCapacity: "1TB",
  },
  {
    id: "ssd-2", name: "WD Blue SN570 500GB", specs: "PCIe 3.0 NVMe", price: 950000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "ssd-hdd", brand: "WD", storageType: "SSD M.2 NVMe", storageCapacity: "500GB - 512GB",
  },
  {
    id: "ssd-3", name: "Kingston NV2 1TB", specs: "PCIe 4.0 NVMe", price: 1450000, originalPrice: 1600000, discount: "-9%", image: mockAvt, categorySlug: "ssd-hdd", brand: "KINGSTON", storageType: "SSD M.2 NVMe", storageCapacity: "1TB",
  },
  {
    id: "ssd-4", name: "Crucial P3 Plus 2TB", specs: "PCIe 4.0 NVMe", price: 3200000, originalPrice: 3500000, discount: "-8%", image: mockAvt, categorySlug: "ssd-hdd", brand: "CRUCIAL", storageType: "SSD M.2 NVMe", storageCapacity: "2TB trở lên",
  },
  {
    id: "ssd-5", name: "Samsung 870 EVO 500GB", specs: "SATA III 2.5 inch", price: 1050000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "ssd-hdd", brand: "SAMSUNG", storageType: "SSD 2.5\" SATA III", storageCapacity: "500GB - 512GB",
  },
  {
    id: "hdd-1", name: "WD Blue 1TB", specs: "HDD 3.5\" / 7200RPM", price: 1100000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "ssd-hdd", brand: "WD", storageType: "HDD 3.5\"", storageCapacity: "1TB",
  },
  {
    id: "hdd-2", name: "WD Black 2TB", specs: "HDD 3.5\" / 7200RPM / Gaming", price: 3400000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "ssd-hdd", brand: "WD", storageType: "HDD 3.5\"", storageCapacity: "2TB trở lên",
  },
  {
    id: "ssd-6", name: "Crucial MX500 1TB", specs: "SATA III 2.5 inch", price: 1850000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "ssd-hdd", brand: "CRUCIAL", storageType: "SSD 2.5\" SATA III", storageCapacity: "1TB",
  },

  // ==========================================
  // NGUỒN & CASE MÁY TÍNH (categorySlug: "psu-case")
  // Filters: psuType, brand, psuPower
  // ==========================================
  {
    id: "psu-1", name: "Nguồn Corsair RM750e", specs: "750W / 80 Plus Gold", price: 2600000, originalPrice: 2850000, discount: "-8%", image: mockAvt, categorySlug: "psu-case", brand: "CORSAIR", psuType: "Nguồn máy tính (PSU)", psuPower: "600W - 750W",
  },
  {
    id: "case-1", name: "Case NZXT H5 Flow", specs: "Mid Tower / ATX", price: 2100000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "psu-case", brand: "NZXT", psuType: "Case (Vỏ máy tính)", psuPower: undefined,
  },
  {
    id: "psu-2", name: "Nguồn Deepcool PK500D", specs: "500W / 80 Plus Bronze", price: 950000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "psu-case", brand: "DEEPCOOL", psuType: "Nguồn máy tính (PSU)", psuPower: "Dưới 600W",
  },
  {
    id: "case-2", name: "Case ASUS Prime AP201", specs: "Micro-ATX / Mesh", price: 1650000, originalPrice: 1800000, discount: "-8%", image: mockAvt, categorySlug: "psu-case", brand: "ASUS", psuType: "Case (Vỏ máy tính)", psuPower: undefined,
  },
  {
    id: "psu-3", name: "Nguồn ASUS ROG Thor 1000W Platinum II", specs: "1000W / 80 Plus Platinum", price: 8900000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "psu-case", brand: "ASUS", psuType: "Nguồn máy tính (PSU)", psuPower: "850W - 1000W",
  },
  {
    id: "case-3", name: "Case Corsair 4000D Airflow", specs: "Mid Tower / ATX", price: 2050000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "psu-case", brand: "CORSAIR", psuType: "Case (Vỏ máy tính)", psuPower: undefined,
  },
  {
    id: "psu-4", name: "Nguồn NZXT C850", specs: "850W / 80 Plus Gold", price: 3200000, originalPrice: 3500000, discount: "-8%", image: mockAvt, categorySlug: "psu-case", brand: "NZXT", psuType: "Nguồn máy tính (PSU)", psuPower: "850W - 1000W",
  },
  {
    id: "case-4", name: "Case Deepcool CH560 Digital", specs: "Mid Tower / Màn LED", price: 2350000, originalPrice: null, discount: null, image: mockAvt, categorySlug: "psu-case", brand: "DEEPCOOL", psuType: "Case (Vỏ máy tính)", psuPower: undefined,
  },
];
