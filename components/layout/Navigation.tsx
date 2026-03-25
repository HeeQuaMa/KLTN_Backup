import React from "react";
import Link from "next/link";

const Navigation = () => {
  return (
    <nav className="bg-primary flex items-center gap-6 overflow-x-auto whitespace-nowrap px-4 py-3 text-sm font-bold text-white uppercase sm:gap-10 md:px-8 lg:px-12 xl:px-16 lg:h-12.5 lg:gap-20 lg:py-0 lg:text-base [&::-webkit-scrollbar]:hidden">
      <Link href="/products" className="transition-colors hover:text-gray-200">
        Danh mục sản phẩm
      </Link>
      <Link href="/build-pc" className="transition-colors hover:text-gray-200">
        Build PC (AI)
      </Link>
      <Link href="/bao-hanh" className="transition-colors hover:text-gray-200">
        Tra cứu bảo hành
      </Link>
      <Link href="/huong-dan" className="transition-colors hover:text-gray-200">
        Hướng dẫn mua hàng
      </Link>
      <Link
        href="/khuyen-mai"
        className="text-destructive transition-colors hover:text-red-400"
      >
        🔥Khuyến mãi Hot
      </Link>
    </nav>
  );
};

export default Navigation;
