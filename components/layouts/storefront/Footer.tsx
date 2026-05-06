import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary-foreground text-secondary-text1 relative lg:h-100">
      <div className="flex flex-col gap-8 px-4 py-8 md:flex-row md:flex-wrap md:gap-16 md:px-8 md:py-12 lg:gap-40 lg:px-12 xl:px-16">
        <div>
          <h2 className="mb-4 text-xl font-bold text-white lg:mb-8 lg:text-[24px]">
            NetTech O2O System
          </h2>
          <p className="flex flex-col gap-3.75 text-sm">
            Hệ thống bán lẻ công nghệ Online-to-Offline.
          </p>
        </div>
        <div>
          <h2 className="mb-4 text-xl font-bold text-white lg:mb-8 lg:text-[24px]">
            CHÍNH SÁCH
          </h2>
          <div className="flex flex-col gap-3.75 text-sm">
            <p>Chính sách bảo hành (Phone lookup)</p>
            <p>Chính sách đổi trả</p>
            <p>Vận chuyển & Giao nhận</p>
          </div>
        </div>
        <div>
          <h2 className="mb-4 text-xl font-bold text-white lg:mb-8 lg:text-[24px]">
            HỖ TRỢ KHÁCH HÀNG
          </h2>
          <div className="flex flex-col gap-3.75 text-sm">
            <p>Tra cứu đơn hàng</p>
            <p>Hướng dẫn Build PC</p>
            <p>Gửi yêu cầu hỗ trợ (Email)</p>
          </div>
        </div>
      </div>

      <hr className="h-px w-full border-gray-700" />
      <div className="mt-4 flex items-center justify-center p-4 text-center text-sm lg:mt-8 lg:p-0 lg:text-base">
        <p>&copy; 2026 NetTech Capstone Project. Van Lang University.</p>
      </div>

    </footer>
  );
};

export default Footer;
