import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ProductFormGeneral } from "@/features/super-admin/products/components/create/ProductFormGeneral";
import { ProductFormPricing } from "@/features/super-admin/products/components/create/ProductFormPricing";
import { ProductFormSpecs } from "@/features/super-admin/products/components/create/ProductFormSpecs";
import { ProductFormImage } from "@/features/super-admin/products/components/create/ProductFormImage";

export default function CreateProductPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="mb-1 text-sm text-slate-500">
            <Link href="/super-admin/products" className="hover:text-blue-600 transition-colors">Sản phẩm</Link>
            <span className="mx-2">&gt;</span>
            <span className="text-slate-400">Thêm mới</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">
            Thêm sản phẩm mới (Master Data)
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/super-admin/products"
            className="rounded-md border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
          >
            HỦY
          </Link>
          <Button className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors">
            LƯU SẢN PHẨM
          </Button>
        </div>
      </div>

      {/* Form Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (General & Pricing) */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <ProductFormGeneral />
          <ProductFormPricing />
        </div>

        {/* Right Column (Specs & Image) */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          <ProductFormSpecs />
          <ProductFormImage />
        </div>
      </div>
    </div>
  );
}
