import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

const AiPcBuilderBanner = () => {
  return (
    <section className="mt-10 mb-8 w-full rounded-2xl bg-[#111827] px-6 py-8 text-white lg:h-75 lg:px-14 lg:py-10">
      <div className="mx-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-160">
          <p className="text-lg font-semibold tracking-wide text-[#60A5FA] uppercase">
            TÍNH NĂNG ĐỘC QUYỀN
          </p>
          <h2 className="mt-1 text-[32px] leading-tight font-bold whitespace-nowrap lg:text-[52px]">
            XÂY DỰNG CẤU HÌNH PC (AI)
          </h2>
          <p className="text-secondary-text1 mt-4 text-lg">
            Kiểm tra tương thích tự động. Tối ưu chi phí. Tư vấn bởi AI.
          </p>
          <Button
            className={cn(
              "bg-primary hover:bg-primary-hover/90 mt-7 h-12 min-w-42 cursor-pointer rounded-full px-8 text-base font-semibold text-white",
            )}
          >
            BẮT ĐẦU NGAY
          </Button>
        </div>

        <div className="w-full max-w-160 rounded-2xl">
          <Image
            src={"/images/pink.jpg"}
            alt="PC Gaming"
            width={500}
            height={200}
            className="h-60 w-full rounded-xl object-cover shadow-[0_10px_30px_rgba(0,0,0,0.35)]"
          />
        </div>
      </div>
    </section>
  );
};

export default AiPcBuilderBanner;
