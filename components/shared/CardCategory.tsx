import Image, { StaticImageData } from "next/image";

interface Category {
  image: StaticImageData;
  nameCategory: string;
}

interface ActiveSelect extends Category {
  isItemActive: boolean;
}

import { cn } from "@/lib/utils";

const CardCategory = ({ image, nameCategory, isItemActive }: ActiveSelect) => {
  return (
    <div
      className={cn(
        "group flex w-24 flex-col items-center justify-start gap-3 rounded-2xl border p-3 transition-all duration-300 sm:w-28 sm:p-4 lg:w-32 lg:gap-4",
        isItemActive
          ? "border-primary bg-primary/5 ring-primary/20 shadow-md ring-1"
          : "border-gray-200 bg-white hover:-translate-y-1 hover:border-gray-300 hover:shadow-sm",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center overflow-hidden rounded-full p-1 transition-transform duration-300 group-hover:scale-110",
          isItemActive ? "ring-primary ring-2 ring-offset-1" : "",
        )}
      >
        <Image
          src={image}
          alt={nameCategory}
          width={56}
          height={56}
          className="aspect-square rounded-full object-cover"
        />
      </div>
      <p
        className={cn(
          "text-center text-xs font-bold transition-colors sm:text-sm",
          isItemActive
            ? "text-primary font-bold"
            : "font-medium text-gray-700 group-hover:text-gray-900",
        )}
      >
        {nameCategory}
      </p>
    </div>
  );
};

export default CardCategory;
