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

      {/* AI Chat Bubble (Gemini Placeholder) */}
      <div
        className="bg-primary fixed right-4 bottom-4 z-50 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full text-white shadow-[0_4px_14px_0_rgba(37,99,235,0.39)] transition-transform hover:scale-110 md:right-8 md:bottom-8 md:h-14 md:w-14"
        title="Trợ lý AI Gemini"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6 md:h-7 md:w-7"
        >
          <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
          <path d="M12 11h.01" />
          <path d="M8 11h.01" />
          <path d="M16 11h.01" />
        </svg>
      </div>
    </footer>
  );
};

export default Footer;
