"use client";

import Link from "next/link";
import { homeCategories } from "@/features/storefront/home/utils/category";

const CategoryFilter = () => {
  return (
    <div className="mt-6 flex gap-3 overflow-x-auto pb-4 pt-2 sm:gap-4 lg:mt-7 [&::-webkit-scrollbar]:hidden">
      {homeCategories.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className="group shrink-0"
          aria-label={`Xem danh mục ${item.name}`}
        >
          <div className="flex w-[72px] flex-col items-center gap-2 rounded-lg border border-gray-200 bg-white px-2 py-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-primary/45 sm:w-[84px]">
            <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-slate-100 sm:h-9 sm:w-9">
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-full w-full object-cover object-center"
              />
            </div>
            <span className="line-clamp-2 text-center text-[10px] font-semibold text-gray-700 group-hover:text-primary sm:text-[11px]">
              {item.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default CategoryFilter;
