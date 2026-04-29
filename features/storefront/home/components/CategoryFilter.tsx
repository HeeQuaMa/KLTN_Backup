"use client";

import { useRouter } from "next/navigation";
import { CardCategory } from "@/components/shared";
import { category } from "@/features/storefront/home/utils/category";
import { useState } from "react";

const CategoryFilter = () => {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("Build PC");

  const handleClick = (item: (typeof category)[number]) => {
    setActiveCategory(item.nameCategory);
    if (item.nameCategory === "Build PC") {
      router.push("/build-pc");
    } else if (item.slug) {
      router.push(`/products?category=${item.slug}`);
    }
  };

  return (
    <div className="mt-8 flex gap-3 overflow-x-auto pt-4 pb-4 sm:gap-5 lg:mt-10 [&::-webkit-scrollbar]:hidden">
      {category.map((item) => (
        <div
          key={item.id}
          className="shrink-0 cursor-pointer"
          onClick={() => handleClick(item)}
        >
          <CardCategory
            image={item.image}
            nameCategory={item.nameCategory}
            isItemActive={activeCategory === item.nameCategory}
          />
        </div>
      ))}
    </div>
  );
};

export default CategoryFilter;
