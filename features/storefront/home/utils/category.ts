// Dùng URL string thay vì StaticImport để tương thích với Next.js <Image src="url">
// Tất cả photo ID đã được xác nhận hoạt động (dùng trong seed.ts)

export const category = [
  {
    id: 1,
    // Laptop: ảnh laptop chuyên nghiệp
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=200&auto=format&fit=crop",
    nameCategory: "Laptop",
    slug: "laptop",
  },
  {
    id: 2,
    // Build PC: ảnh bo mạch chủ (confirmed)
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=200&auto=format&fit=crop",
    nameCategory: "Build PC",
    slug: "build-pc",
  },
  {
    id: 3,
    // VGA: ảnh card đồ hoạ NVIDIA (confirmed)
    image: "https://images.unsplash.com/photo-1591488320449-011701c6d4d4?q=80&w=200&auto=format&fit=crop",
    nameCategory: "VGA",
    slug: "vga",
  },
  {
    id: 4,
    // CPU: ảnh chip Intel (confirmed)
    image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?q=80&w=200&auto=format&fit=crop",
    nameCategory: "CPU",
    slug: "cpu",
  },
  {
    id: 5,
    // RAM: ảnh thanh RAM (confirmed)
    image: "https://images.unsplash.com/photo-1562976540-1502c2145186?q=80&w=200&auto=format&fit=crop",
    nameCategory: "RAM",
    slug: "ram",
  },
  {
    id: 6,
    // Bảo hành: ảnh thiết bị điện tử / hỗ trợ
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?q=80&w=200&auto=format&fit=crop",
    nameCategory: "Bảo hành",
    slug: null,
  },
];
