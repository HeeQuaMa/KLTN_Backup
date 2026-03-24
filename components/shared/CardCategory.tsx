import Image, { StaticImageData } from "next/image";

interface Category {
  image: StaticImageData;
  nameCategory: string;
}

interface ActiveSelect extends Category {
  isItemActive: boolean;
}

const CardCategory = ({ image, nameCategory, isItemActive }: ActiveSelect) => {
  return (
    <div
      className={`mt-10 flex flex-col items-center justify-center gap-2.75 rounded-2xl border lg:h-30 lg:w-30 ${isItemActive ? "border-primary text-primary border-2 font-bold" : "border-gray-200"}`}
    >
      <Image
        src={image}
        alt="image"
        width={50}
        height={50}
        className="aspect-square rounded-full object-cover"
      />
      <p className="text-sm font-bold">{nameCategory}</p>
    </div>
  );
};

export default CardCategory;
