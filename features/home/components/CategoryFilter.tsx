"use client";
import { CardCategory } from "@/components/shared";
import { category } from "@/features/home/utils/category";
import { useState } from "react";
const CategoryFilter = () => {
  const [activeCategory, setActiveCategory] = useState("Build PC");
  return (
    <div className="flex gap-5">
      {category.map((item) => (
        <div
          key={item.id}
          className="cursor-pointer"
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
