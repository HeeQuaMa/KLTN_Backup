import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";

const AiPcBuilderBanner = () => {
  return (
    <section className="mt-8 mb-8 w-full rounded-2xl bg-[#111827] px-4 py-8 text-white lg:mt-10 lg:min-h-75 lg:px-14 lg:py-10">
      <div className="mx-0 flex flex-col gap-8 sm:mx-4 lg:mx-8 lg:flex-row lg:items-center lg:justify-between xl:gap-12">
        <div className="flex-1 max-w-[600px]">
          <p className="text-sm font-semibold tracking-wide text-[#60A5FA] uppercase lg:text-lg">
            TÍNH NĂNG ĐỘC QUYỀN
          </p>
          <h2 className="mt-2 text-2xl font-bold leading-tight lg:mt-2 lg:text-[40px] xl:text-[52px]">
            XÂY DỰNG CẤU HÌNH PC (AI)
          </h2>
          <p className="text-secondary-text1 mt-3 text-base lg:mt-4 lg:text-lg">
            Kiểm tra tương thích tự động. Tối ưu chi phí. Tư vấn bởi AI.
          </p>
          <Button
            className={cn(
              "bg-primary hover:bg-primary-hover/90 mt-6 h-11 w-full flex-1 cursor-pointer rounded-full px-8 text-base font-semibold text-white sm:w-auto lg:mt-7 lg:h-12 lg:min-w-42",
            )}
          >
            BẮT ĐẦU NGAY
          </Button>
        </div>

        <div className="w-full shrink-0 lg:w-[45%] max-w-[500px] rounded-2xl lg:mt-0">
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
