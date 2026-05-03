// Ảnh sản phẩm nổi bật trên trang chủ
// Dùng URL string thay vì StaticImport, tương thích với ProductCard (image: string | null)
// Tất cả photo ID đã xác nhận hoạt động

export const product = [
  {
    id: 101,
    name: "Asus ROG Strix G16",
    specs: "i7-13650HX / RTX 4060",
    image: "/globe.svg",
    price: 32_990_000,
  },
  {
    id: 102,
    name: "MacBook Pro 14 M3",
    specs: "Apple M3 Pro / 18GB",
    image: "/globe.svg",
    price: 45_000_000,
  },
  {
    id: 103,
    name: "Dell XPS 15 9530",
    specs: "Core i9 / OLED 3.5K",
    image: "/globe.svg",
    price: 55_000_000,
  },
  {
    id: 104,
    name: "LG Gram 17 2024",
    specs: "Siêu nhẹ / Pin 20h",
    image: "/globe.svg",
    price: 32_000_000,
  },
];

export const productBuildPC = [
  {
    id: 201,
    name: "Intel Core i9-14900K",
    specs: "6.0 GHz / 24 Cores",
    image: "/file.svg",
    price: 14_990_000,
  },
  {
    id: 202,
    name: "RTX 4080 Super",
    specs: "16GB GDDR6X",
    image: "/window.svg",
    price: 35_000_000,
  },
  {
    id: 203,
    name: "Mainboard Z790",
    specs: "WiFi 7 / DDR5",
    image: "/next.svg",
    price: 8_900_000,
  },
  {
    id: 204,
    name: "RAM Corsair 32GB",
    specs: "DDR5 6000MHz",
    image: "/file.svg",
    price: 3_500_000,
  },
];

export type Product = (typeof product)[number];
export type ProductBuildPC = (typeof productBuildPC)[number];
