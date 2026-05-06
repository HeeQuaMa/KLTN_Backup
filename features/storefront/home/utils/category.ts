export type HomeCategoryItem = {
  id: number;
  name: string;
  imageUrl: string;
  href: string;
};

export const homeCategories: HomeCategoryItem[] = [
  {
    id: 1,
    name: "Laptop",
    imageUrl: "/images/categories/laptop.svg",
    href: "/category/laptop-gaming",
  },
  {
    id: 2,
    name: "Build PC",
    imageUrl: "/images/categories/build-pc.svg",
    href: "/build-pc",
  },
  {
    id: 3,
    name: "VGA",
    imageUrl: "/images/categories/vga.svg",
    href: "/category/vga",
  },
  {
    id: 4,
    name: "CPU",
    imageUrl: "/images/categories/cpu.svg",
    href: "/category/cpu",
  },
  {
    id: 5,
    name: "Bảo hành",
    imageUrl: "/images/categories/warranty.svg",
    href: "/bao-hanh",
  },
];
