"use client";
import { CardCategory } from "@/components/shared";
import { category } from "@/features/home/utils/category";
import { useState } from "react";
const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState("Build PC");
  return (
    <div className="mt-8 flex gap-3 overflow-x-auto pt-4 pb-4 sm:gap-5 lg:mt-10 [&::-webkit-scrollbar]:hidden">
      {category.map((item) => (
        <div
          key={item.id}
          className="shrink-0 cursor-pointer"
          onClick={() => setActiveCategory(item.nameCategory)}
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
