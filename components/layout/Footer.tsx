import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary-foreground text-secondary-text1 lg:h-100">
      <div className="flex gap-60 p-15">
        <div>
          <h2 className="mb-8 text-[24px] font-bold text-white">
            NetTech O2O System
          </h2>
          <p className="flex flex-col gap-3.75 text-sm">
            Hệ thống bán lẻ công nghệ Online-to-Offline.
          </p>
        </div>
        <div>
          <h2 className="mb-8 text-[24px] font-bold text-white">CHÍNH SÁCH</h2>
          <div className="flex flex-col gap-3.75 text-sm">
            <p>Chính sách bảo hành (Phone lookup)</p>
            <p>Chính sách đổi trả</p>
            <p>Vận chuyển & Giao nhận</p>
          </div>
        </div>
        <div>
          <h2 className="mb-8 text-[24px] font-bold text-white">
            HỖ TRỢ KHÁCH HÀNG
          </h2>
          <div className="flex flex-col gap-3.75 text-sm">
            <p>Tra cứu đơn hàng</p>
            <p>Hướng dẫn Build PC</p>
            <p>Gửi yêu cầu hỗ trợ (Email)</p>
          </div>
        </div>
      </div>

      <hr className="h-px w-full" />
      <div className="mt-8 flex items-center justify-center">
        <p>&copy; 2026 NetTech Capstone Project. Van Lang University.</p>
      </div>
    </footer>
  );
};

export default Footer;
