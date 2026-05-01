import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

// Ảnh bo mạch chủ chất lượng cao (confirmed từ seed.ts)
const PC_BUILD_IMAGE =
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=900&auto=format&fit=crop";

const AiPcBuilderBanner = () => {
  return (
    <section className="mt-8 mb-8 w-full overflow-hidden rounded-2xl bg-background-third px-4 py-8 text-white lg:mt-10 lg:min-h-75 lg:px-14 lg:py-10">
      <div className="mx-0 flex flex-col gap-8 sm:mx-4 lg:mx-8 lg:flex-row lg:items-center lg:justify-between xl:gap-12">
        {/* Text content */}
        <div className="max-w-150 flex-1">
          <p className="text-sm font-semibold tracking-wide text-text-highlight uppercase lg:text-lg">
            TÍNH NĂNG ĐỘC QUYỀN
          </p>
          <h2 className="mt-2 text-2xl leading-tight font-bold lg:mt-2 lg:text-[40px] xl:text-[52px]">
            XÂY DỰNG CẤU HÌNH PC (AI)
          </h2>
          <p className="text-secondary-text1 mt-3 text-base lg:mt-4 lg:text-lg">
            Kiểm tra tương thích tự động. Tối ưu chi phí. Tư vấn bởi AI.
          </p>
          <Link href="/build-pc">
            <Button
              className={cn(
                "bg-primary hover:bg-primary-hover/90 mt-6 h-11 w-full flex-1 cursor-pointer rounded-full px-8 text-base font-semibold text-white transition-transform hover:scale-105 sm:w-auto lg:mt-7 lg:h-12 lg:min-w-42",
              )}
            >
              BẮT ĐẦU NGAY
            </Button>
          </Link>
        </div>

        {/* Banner image with hover scale */}
        <div className="w-full max-w-125 shrink-0 overflow-hidden rounded-2xl lg:mt-0 lg:w-[45%]">
          <Image
            src={PC_BUILD_IMAGE}
            alt="PC Gaming Build"
            width={500}
            height={200}
            className="h-60 w-full rounded-xl object-cover shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div>
    </section>
  );
};

export default AiPcBuilderBanner;
