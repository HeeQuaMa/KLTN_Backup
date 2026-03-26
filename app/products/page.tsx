import React from "react";
import SidebarFilter from "@/features/products/components/SidebarFilter";
import ProductSortBar from "@/features/products/components/ProductSortBar";
import ProductCard from "@/components/shared/ProductCard";
import { mockProducts } from "@/features/products/utils/mockData";

const Products = () => {
  return (
    <main className="min-h-screen bg-white px-4 py-6 md:px-8 lg:px-12 lg:py-10 xl:px-16">
      <div className="mx-auto flex w-full max-w-350 flex-col items-start gap-8 lg:flex-row lg:gap-12">
        {/* Sidebar */}
        <SidebarFilter />

        {/* Main Content */}
        <div className="w-full flex-1">
          <ProductSortBar />

          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 2xl:grid-cols-4">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Products;
