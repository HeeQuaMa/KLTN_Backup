import Image from "next/image";
import { cn } from "@/lib/utils";

interface CardCategoryProps {
  image: string;
  nameCategory: string;
  isItemActive?: boolean;
}

const CardCategory = ({ image, nameCategory, isItemActive }: CardCategoryProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-xl border px-4 py-3 transition-all duration-200",
        isItemActive
          ? "border-primary bg-primary/5 text-primary shadow-sm"
          : "border-gray-200 bg-white text-gray-600 hover:border-primary/40 hover:shadow-sm hover:text-primary",
      )}
    >
      {/* Thumbnail with hover scale */}
      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
        <Image
          src={image}
          alt={nameCategory}
          fill
          className="object-cover transition-transform duration-300 hover:scale-110"
          sizes="40px"
        />
      </div>

      <span
        className={cn(
          "whitespace-nowrap text-sm font-semibold",
          isItemActive ? "text-primary" : "text-gray-700",
        )}
      >
        {nameCategory}
      </span>
    </div>
  );
};

export default CardCategory;
