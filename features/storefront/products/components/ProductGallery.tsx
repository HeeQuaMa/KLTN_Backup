"use client";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import Image from "next/image";
import { DetailedProduct } from "@/features/storefront/products/utils/mockProductDetail";

export const ProductGallery = ({ product }: { product: DetailedProduct }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image */}
      <div className="relative aspect-square w-full rounded-2xl bg-gray-50 flex items-center justify-center p-8 overflow-hidden border border-gray-100">
        <Image
          src={product.images[activeIndex]}
          alt={product.name}
          fill
          className="object-contain p-8 mix-blend-multiply transition-transform hover:scale-105 duration-300"
        />
      </div>

      {/* Thumbnails */}
      <div className="flex gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
        {product.images.map((img, index) => (
          <Button
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`cursor-pointer relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-50 flex items-center justify-center transition-colors ${
              activeIndex === index 
                ? "border-primary ring-1 ring-primary/20" 
                : "border-gray-100 hover:border-gray-300"
            }`}
          >
            <Image
              src={img}
              alt={`${product.name} thumbnail ${index + 1}`}
              fill
              className="object-contain p-2 mix-blend-multiply"
            />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
