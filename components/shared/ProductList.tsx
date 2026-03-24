import { Button } from "@/components/ui/button";
import Image from "next/image";
import type { Product } from "@/features/home/utils/product";
import Line from "./Line";

interface ProductListProps {
  title: string;
  products: Product[];
}

const ProductList = ({ title, products }: ProductListProps) => {
  const vndFormatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  const formatPriceVND = (price: number) => `${vndFormatter.format(price)}`;
  return (
    <div className="mt-8">
      <h2 className="text-[28px] font-bold">{title}</h2>
      <Line />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        {products.map((data) => (
          <div
            className="bg-card flex min-h-110 w-full flex-col rounded-2xl border border-[#E5E7EB] p-5 lg:min-w-77.5"
            key={data.name}
          >
            <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-xl">
              <Image
                src={data.image}
                alt={data.name}
                width={270}
                height={300}
                className="h-full w-full object-contain"
                priority
              />
            </div>
            <div className="mt-4 flex flex-1 flex-col gap-3">
              <h3 className="text-[20px] leading-snug font-semibold">
                {data.name}
              </h3>
              <p className="text-secondary-text1 mt-1 leading-snug">
                {data.specs}
              </p>
              <div className="text-destructive text-[22px] font-bold">
                {formatPriceVND(data.price)}
              </div>
            </div>
            <Button className="bg-primary hover:bg-primary-hover/90 mt-4 h-11 w-full rounded-lg font-bold text-white">
              MUA NGAY
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
