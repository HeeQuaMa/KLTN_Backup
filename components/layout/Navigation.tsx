import React from "react";

const Navigation = () => {
  return (
    <nav className="bg-primary flex items-center gap-20 px-15 font-bold text-white uppercase lg:h-12.5">
      <p>Danh mục sản phẩm</p>
      <p>Build PC (AI)</p>
      <p>Tra cứu bảo hành</p>
      <p>Hướng dẫn mua hàng</p>
      <p className="text-destructive">🔥Khuyến mãi Hot</p>
    </nav>
  );
};

export default Navigation;
