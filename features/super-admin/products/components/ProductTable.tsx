// features/super-admin/products/components/ProductTable.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pencil, Lock, Unlock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Product,
  CategoryOption,
  extractSpecs,
  getCategories,
  toggleProductVisibility,
  updateProduct,
} from "@/lib/api/productApi";

interface ProductTableProps {
  data: Product[];
  isLoading: boolean;
  onRefresh: () => Promise<void> | void;
}

type EditFormState = {
  name: string;
  sku: string;
  brand: string;
  price: number;
  category: string;
  description: string;
};

const toCategoryId = (category: Product["category"]): string => {
  if (!category) return "";
  if (typeof category === "string") return category;
  return category._id || "";
};

export function ProductTable({ data, isLoading, onRefresh }: ProductTableProps) {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const [form, setForm] = useState<EditFormState>({
    name: "",
    sku: "",
    brand: "",
    price: 0,
    category: "",
    description: "",
  });

  const selectedProductId = selectedProduct?._id || "";

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const rows = await getCategories();
        setCategories(rows);
      } catch (error) {
        console.warn("Không thể tải danh mục sản phẩm:", error);
      }
    };
    loadCategories();
  }, []);

  const canSubmit = useMemo(() => {
    return (
      form.name.trim().length > 0 &&
      form.sku.trim().length > 0 &&
      Number.isFinite(Number(form.price)) &&
      Number(form.price) >= 0 &&
      form.category.trim().length > 0
    );
  }, [form]);

  const openEditModal = (product: Product) => {
    setSelectedProduct(product);
    setForm({
      name: product.name || "",
      sku: product.sku || "",
      brand: product.brand || "",
      price: Number(product.price) || 0,
      category: toCategoryId(product.category),
      description: product.description || "",
    });
    setIsEditOpen(true);
  };

  const handleSaveProduct = async () => {
    if (!selectedProductId || !canSubmit) return;
    setIsSubmitting(true);
    try {
      await updateProduct(selectedProductId, {
        name: form.name.trim(),
        sku: form.sku.trim(),
        brand: form.brand.trim(),
        price: Number(form.price),
        category: form.category,
        description: form.description,
      });
      setIsEditOpen(false);
      setSelectedProduct(null);
      await onRefresh();
    } catch (error) {
      console.warn("Cập nhật sản phẩm thất bại:", error);
      alert("Không thể lưu thay đổi sản phẩm.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleVisibility = async (product: Product) => {
    const id = product._id;
    if (!id) return;
    const nextActive = !(product.isActive ?? true);
    const confirmMsg = nextActive
      ? "Bạn muốn hiện lại sản phẩm này?"
      : "Ẩn sản phẩm này khỏi Storefront?";
    if (!window.confirm(confirmMsg)) return;

    setIsToggling(id);
    try {
      await toggleProductVisibility(id, nextActive);
      await onRefresh();
    } catch (error) {
      console.warn("Cập nhật trạng thái sản phẩm thất bại:", error);
      alert("Không thể cập nhật trạng thái sản phẩm.");
    } finally {
      setIsToggling(null);
    }
  };

  return (
    <>
      <div className="relative min-h-[400px] rounded-xl bg-white shadow-sm">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-xs tracking-wider text-slate-500 uppercase">
                <th className="px-6 py-4 font-semibold">SẢN PHẨM</th>
                <th className="px-6 py-4 font-semibold">DANH MỤC</th>
                <th className="px-6 py-4 font-semibold">GIÁ BÁN</th>
                <th className="px-6 py-4 font-semibold">TỒN KHO</th>
                <th className="px-6 py-4 font-semibold">
                  THÔNG SỐ BUILD PC (AI)
                </th>
                <th className="px-6 py-4 text-right font-semibold">HÀNH ĐỘNG</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.length === 0 && !isLoading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Không tìm thấy sản phẩm nào.
                  </td>
                </tr>
              ) : (
                data.map((product) => {
                  const specsString = extractSpecs(
                    product.specifications,
                    product.brand,
                  );
                  const badges =
                    specsString !== product.brand ? specsString.split(" / ") : [];
                  const isActive = product.isActive ?? true;

                  return (
                    <tr
                      key={product._id}
                      className={cn(
                        "transition-colors hover:bg-slate-50",
                        !isActive && "bg-slate-50 opacity-65",
                      )}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-100">
                            {product.images?.[0] && (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="max-h-full max-w-full object-cover"
                              />
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="line-clamp-1 font-semibold text-blue-600">
                              {product.name}
                            </span>
                            <span className="text-xs text-slate-400">
                              SKU: {product.sku}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {(product.category as any)?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-slate-800">
                        {new Intl.NumberFormat("vi-VN").format(product.price || 0)}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={cn(
                            "font-bold",
                            (product.totalStock || 0) > 10
                              ? "text-green-600"
                              : "text-red-600",
                          )}
                        >
                          {product.totalStock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1.5">
                          {badges.map((badge, idx) => (
                            <span
                              key={idx}
                              className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-xs text-slate-500"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEditModal(product)}
                            className="h-8 w-8 rounded text-slate-400 transition-colors hover:bg-slate-100 hover:text-blue-600"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleVisibility(product)}
                            disabled={isToggling === product._id}
                            className={cn(
                              "h-8 w-8 rounded transition-colors",
                              isActive
                                ? "text-slate-400 hover:bg-yellow-50 hover:text-yellow-600"
                                : "text-red-500 hover:bg-green-50 hover:text-green-600",
                            )}
                            title={isActive ? "Ẩn sản phẩm" : "Hiện sản phẩm"}
                          >
                            {isToggling === product._id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : isActive ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa sản phẩm</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-slate-700">Tên sản phẩm</label>
              <Input
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-slate-700">SKU</label>
                <Input
                  value={form.sku}
                  onChange={(e) => setForm((prev) => ({ ...prev, sku: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-slate-700">Giá bán</label>
                <Input
                  type="number"
                  min={0}
                  value={form.price}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, price: Number(e.target.value) || 0 }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-slate-700">Thương hiệu</label>
                <Input
                  value={form.brand}
                  onChange={(e) => setForm((prev) => ({ ...prev, brand: e.target.value }))}
                />
              </div>
              <div className="grid gap-1.5">
                <label className="text-sm font-medium text-slate-700">Danh mục</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((prev) => ({ ...prev, category: e.target.value }))}
                  className="h-10 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-1.5">
              <label className="text-sm font-medium text-slate-700">Mô tả</label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, description: e.target.value }))
                }
                rows={3}
                className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditOpen(false)}
              disabled={isSubmitting}
            >
              Hủy
            </Button>
            <Button onClick={handleSaveProduct} disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
