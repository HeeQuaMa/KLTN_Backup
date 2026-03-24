import mockAvt from "@/public/images/pink.jpg";

export const product = [
  {
    name: "Asus ROG Strix G16",
    specs: "i7-13650HX / RTX 4060",
    image: mockAvt,
    price: 32990000,
  },
  {
    name: "MacBook Pro 14 M3",
    specs: "Apple M3 Pro / 18GB",
    image: mockAvt,
    price: 45000000,
  },
  {
    name: "Dell XPS 15 9530",
    specs: "Core i9 / OLED 3.5K",
    image: mockAvt,
    price: 55000000,
  },
  {
    name: "LG Gram 17 2024",
    specs: "Siêu nhẹ / Pin 20h",
    image: mockAvt,
    price: 32000000,
  },
];

export const productBuildPC = [
  {
    name: "Intel Core i9-14900K",
    specs: "6.0 GHz / 24 Cores",
    image: mockAvt,
    price: 14990000,
  },
  {
    name: "RTX 4080 Super",
    specs: "16GB GDDR6X",
    image: mockAvt,
    price: 35000000,
  },
  {
    name: "Mainboard Z790",
    specs: "WiFi 7 / DDR5",
    image: mockAvt,
    price: 8900000,
  },
  {
    name: "RAM Corsair 32GB",
    specs: "DDR5 6000MHz",
    image: mockAvt,
    price: 3500000,
  },
];

export type Product = (typeof product)[number];
export type ProductBuildPC = (typeof productBuildPC)[number];
