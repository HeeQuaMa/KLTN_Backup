"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "react-toastify";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createProductWithImages,
  getCategories,
  type CategoryOption,
  type ProductSpecifications,
} from "@/lib/api/productApi";
import type { Resolver } from "react-hook-form";

import { ProductFormImage } from "@/features/super-admin/products/components/create/ProductFormImage";

const createProductSchema = z.object({
  name: z.string().min(1, "Nhập tên sản phẩm"),
  sku: z.string().min(1, "Nhập mã SKU"),
  brand: z.string().optional(),
  categorySlug: z.string().min(1, "Chọn danh mục"),
  description: z.string().optional(),
  price: z.coerce.number().min(0, "Giá bán không hợp lệ"),
  importPrice: z.preprocess(
    (v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    },
    z.number().min(0).optional(),
  ),
  vatPercent: z.preprocess(
    (v) => {
      if (v === "" || v === null || v === undefined) return undefined;
      const n = Number(v);
      return Number.isFinite(n) ? n : undefined;
    },
    z.number().min(0).optional(),
  ),
  totalStock: z.coerce.number().min(0).optional().default(0),
  socket: z.string().optional(),
  tdp: z.string().optional(),
  ramType: z.enum(["DDR4", "DDR5"]).optional(),
  igpu: z.boolean().optional(),
});

export type CreateProductFormValues = {
  name: string;
  sku: string;
  brand?: string;
  categorySlug: string;
  description?: string;
  price: number;
  importPrice?: number;
  vatPercent?: number;
  totalStock: number;
  socket?: string;
  tdp?: string;
  ramType?: "DDR4" | "DDR5";
  igpu?: boolean;
};

function ProductFormGeneralBlock({ categories }: { categories: CategoryOption[] }) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateProductFormValues>();

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-slate-800">1. Thông tin chung</h2>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Tên sản phẩm *</label>
          <Input
            {...register("name")}
            type="text"
            placeholder="Ví dụ: Intel Core i9-14900K"
            className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.name && (
            <p className="text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Mã SKU (Duy nhất) *</label>
            <Input
              {...register("sku")}
              type="text"
              placeholder="CPU-INT-149"
              className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            {errors.sku && (
              <p className="text-xs text-red-600">{errors.sku.message}</p>
            )}
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold text-slate-700">Thương hiệu</label>
            <Input
              {...register("brand")}
              type="text"
              placeholder="Intel"
              className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Danh mục *</label>
          <select
            {...register("categorySlug")}
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">— Chọn danh mục —</option>
            {categories.map((c) => (
              <option key={c._id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.categorySlug && (
            <p className="text-xs text-red-600">{errors.categorySlug.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Mô tả sản phẩm</label>
          <textarea
            {...register("description")}
            placeholder="Nhập mô tả chi tiết..."
            rows={5}
            className="w-full resize-y rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
}

function ProductFormPricingBlock() {
  const {
    register,
    formState: { errors },
  } = useFormContext<CreateProductFormValues>();

  return (
    <div className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-base font-bold text-slate-800">2. Giá bán &amp; Kho</h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Giá nhập (VNĐ)</label>
          <Input
            {...register("importPrice")}
            type="number"
            min={0}
            step={1000}
            placeholder="12500000"
            className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Giá bán lẻ (VNĐ) *</label>
          <Input
            {...register("price")}
            type="number"
            min={0}
            step={1000}
            placeholder="14990000"
            className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          {errors.price && (
            <p className="text-xs text-red-600">{errors.price.message}</p>
          )}
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Thuế VAT (%)</label>
          <Input
            {...register("vatPercent")}
            type="number"
            min={0}
            placeholder="8"
            className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1.5 pr-2 sm:w-1/3">
        <label className="text-sm font-semibold text-slate-700">Tồn kho ban đầu (Kho tổng)</label>
        <Input
          {...register("totalStock")}
          type="number"
          min={0}
          placeholder="0"
          className="w-full rounded-md border border-slate-200 px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

function ProductFormSpecsBlock() {
  const { register, watch, setValue } = useFormContext<CreateProductFormValues>();
  const ramType = watch("ramType");

  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center text-base font-bold text-blue-600">
          3. Thông số Build PC
        </h2>
        <span className="text-xs font-semibold text-blue-500">Tùy chọn</span>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Socket Type</label>
          <select
            {...register("socket")}
            className="w-full appearance-none rounded-md border border-slate-200 bg-white py-2 pl-4 pr-10 text-sm text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="LGA 1700">LGA 1700</option>
            <option value="AM5">AM5</option>
            <option value="AM4">AM4</option>
            <option value="LGA 1851">LGA 1851</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">TDP (Công suất nhiệt - W)</label>
          <Input
            {...register("tdp")}
            type="text"
            inputMode="numeric"
            placeholder="125"
            className="w-full rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Hỗ trợ RAM</label>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className={
                ramType === "DDR5"
                  ? "rounded-md border border-blue-500 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600"
                  : "rounded-md border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              }
              onClick={() => setValue("ramType", "DDR5")}
            >
              DDR5
            </Button>
            <Button
              type="button"
              variant="outline"
              className={
                ramType === "DDR4"
                  ? "rounded-md border border-blue-500 bg-blue-50 px-4 py-1.5 text-sm font-semibold text-blue-600"
                  : "rounded-md border border-slate-200 bg-white px-4 py-1.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              }
              onClick={() => setValue("ramType", "DDR4")}
            >
              DDR4
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold text-slate-700">Có iGPU (Đồ họa tích hợp)?</label>
          <div className="flex items-center gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
              <input type="checkbox" {...register("igpu")} className="size-4 rounded border-slate-300" />
              Có đồ họa tích hợp
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

function buildSpecifications(values: CreateProductFormValues): ProductSpecifications {
  const s: ProductSpecifications = {};
  if (values.socket) s.socket = values.socket;
  const tdpNum = values.tdp?.trim() ? Number(values.tdp) : undefined;
  if (Number.isFinite(tdpNum)) s.tdp = tdpNum;
  if (values.ramType) s.ramType = values.ramType;
  if (values.igpu !== undefined) s.igpu = values.igpu;
  if (values.vatPercent !== undefined && Number.isFinite(values.vatPercent)) {
    s.vatPercent = values.vatPercent;
  }
  return s;
}

export function CreateProductForm() {
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);

  const methods = useForm<CreateProductFormValues>({
    resolver: zodResolver(createProductSchema) as Resolver<CreateProductFormValues>,
    defaultValues: {
      name: "",
      sku: "",
      brand: "",
      categorySlug: "",
      description: "",
      price: 0,
      importPrice: undefined,
      vatPercent: 8,
      totalStock: 0,
      socket: "LGA 1700",
      tdp: "",
      ramType: "DDR5",
      igpu: true,
    },
  });

  useEffect(() => {
    let revoked: string[] = [];
    const urls = files.map((f) => URL.createObjectURL(f));
    revoked = urls;
    setPreviewUrls(urls);
    return () => revoked.forEach((u) => URL.revokeObjectURL(u));
  }, [files]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const list = await getCategories();
        if (!cancelled) setCategories(list);
      } catch {
        toast.error("Không tải được danh mục.");
      } finally {
        if (!cancelled) setLoadingCats(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const onSubmit = methods.handleSubmit(async (values) => {
    try {
      const ip = Number.isFinite(values.importPrice) ? values.importPrice : undefined;
      await createProductWithImages(
        {
          name: values.name.trim(),
          sku: values.sku.trim(),
          brand: values.brand,
          categorySlug: values.categorySlug,
          description: values.description,
          price: values.price,
          importPrice: ip,
          totalStock: values.totalStock ?? 0,
          specifications: buildSpecifications(values),
        },
        files,
      );
      toast.success("Đã tạo sản phẩm.");
      router.push("/super-admin/products");
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const raw = e.response?.data as { message?: string | string[] } | undefined;
        const m = raw?.message;
        const text = Array.isArray(m)
          ? m.join(", ")
          : typeof m === "string"
            ? m
            : (e.message ?? "Lỗi tạo sản phẩm");
        toast.error(text);
      } else {
        toast.error("Lỗi tạo sản phẩm");
      }
    }
  });

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit} className="flex flex-col gap-6 p-8">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="mb-1 text-sm text-slate-500">
              <Link
                href="/super-admin/products"
                className="transition-colors hover:text-blue-600"
              >
                Sản phẩm
              </Link>
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
              className="rounded-md border border-slate-300 bg-white px-6 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              HỦY
            </Link>
            <Button
              type="submit"
              disabled={methods.formState.isSubmitting || loadingCats}
              className="rounded-md bg-blue-600 px-6 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              {methods.formState.isSubmitting ? "Đang lưu…" : "LƯU SẢN PHẨM"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6 lg:col-span-2">
            <ProductFormGeneralBlock categories={categories} />
            <ProductFormPricingBlock />
          </div>
          <div className="flex flex-col gap-6 lg:col-span-1">
            <ProductFormSpecsBlock />
            <ProductFormImage
              files={files}
              onFilesChange={setFiles}
              previewUrls={previewUrls}
            />
          </div>
        </div>
      </form>
    </FormProvider>
  );
}
