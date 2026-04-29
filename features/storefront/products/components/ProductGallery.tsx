"use client";

import { Button } from "@/components/ui/button";

import { useState } from "react";
import { DetailedProduct } from "@/features/storefront/products/utils/mockProductDetail";

export const ProductGallery = ({ product }: { product: DetailedProduct }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main Image — <img> để hỗ trợ mọi CDN ảnh từ seed */}
      <div className="relative aspect-square w-full rounded-2xl bg-gray-50 flex items-center justify-center p-8 overflow-hidden border border-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.images[activeIndex]}
          alt={product.name}
          className="max-h-full max-w-full object-contain p-8 mix-blend-multiply transition-transform duration-300 hover:scale-105"
          loading="eager"
          decoding="async"
          referrerPolicy="no-referrer"
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img}
              alt={`${product.name} thumbnail ${index + 1}`}
              className="max-h-[72px] max-w-[72px] object-contain p-2 mix-blend-multiply"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
