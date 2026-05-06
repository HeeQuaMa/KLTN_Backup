"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductSortBar, ProductPagination } from "@/features/storefront/products/components";
import ProductCard, { type ProductType } from "@/components/shared/ProductCard";
import {
  getProducts,
  mapProductToCard,
  type ProductQueryParams,
} from "@/lib/api/productApi";
import http from "@/lib/axiosInstance";

const PRODUCTS_PER_PAGE = 12;

// ── Inner component (needs useSearchParams → must be inside <Suspense>) ──────

function ProductsInner() {
  const searchParams = useSearchParams();

  // Đọc các filter từ URL query params (khi điều hướng từ mega menu)
  const categoryFromUrl = searchParams.get("category") ?? undefined;
  const searchFromUrl   = searchParams.get("search")   ?? undefined;
  const brandFromUrl    = searchParams.get("brand")    ?? undefined;

  const [products,    setProducts]    = useState<ProductType[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages,  setTotalPages]  = useState(1);
  const [totalItems,  setTotalItems]  = useState(0);
  const [filters,     setFilters]     = useState<Partial<ProductQueryParams>>({
    category: categoryFromUrl,
    search:   searchFromUrl,
    brand:    brandFromUrl,
  });
  const [sort,    setSort]    = useState("");
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  // Tên danh mục đang lọc (để hiển thị trong tiêu đề trang)
  const [activeCategoryName, setActiveCategoryName] = useState<string | null>(null);

  // Đồng bộ filter khi URL thay đổi (ví dụ điều hướng từ mega menu)
  useEffect(() => {
    setFilters({
      category: categoryFromUrl,
      search:   searchFromUrl,
      brand:    brandFromUrl,
    });
    setCurrentPage(1);
  }, [categoryFromUrl, searchFromUrl, brandFromUrl]);

  // Lấy tên danh mục từ API khi có categoryFromUrl.
  // Hỗ trợ cả slug (ví dụ: "cpu") lẫn ObjectId (24-char hex).
  useEffect(() => {
    if (!categoryFromUrl) {
      setActiveCategoryName(null);
      return;
    }
    const isObjectId = /^[a-f\d]{24}$/i.test(categoryFromUrl);
    const endpoint = isObjectId
      ? `/categories/${categoryFromUrl}`
      : `/categories/slug/${categoryFromUrl}`;

    http
      .get<{ name: string }>(endpoint)
      .then((res) => setActiveCategoryName(res.data?.name ?? null))
      .catch(() => setActiveCategoryName(null));
  }, [categoryFromUrl]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProducts({
        page:  currentPage,
        limit: PRODUCTS_PER_PAGE,
        sort:  sort || undefined,
        ...filters,
      });
      const safeProducts = (data?.products ?? []).filter(Boolean);
      setProducts(safeProducts.map(mapProductToCard));
      setTotalPages(data?.pagination?.pages ?? 1);
      setTotalItems(data?.pagination?.total ?? 0);
    } catch (err) {
      console.error("[ProductsPage]", err);
      setError("Không thể tải sản phẩm. Vui lòng kiểm tra kết nối đến backend.");
      setProducts([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, sort, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleSortChange = (newSort: string) => {
    setSort(newSort);
    setCurrentPage(1);
  };

  // Tiêu đề trang: hiện tên danh mục nếu đang lọc
  const pageTitle = activeCategoryName
    ? activeCategoryName
    : searchFromUrl
      ? `Kết quả tìm kiếm: "${searchFromUrl}"`
      : "Tất cả sản phẩm";

  return (
    <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 md:px-8 lg:px-12 lg:py-10 xl:px-16">

      {/* Tiêu đề + số lượng */}
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 lg:text-3xl">{pageTitle}</h1>
        {!loading && totalItems > 0 && (
          <span className="text-sm text-gray-400">
            {totalItems} sản phẩm
          </span>
        )}
      </div>

      {/* Sort bar — full width, không cần sidebar */}
      <ProductSortBar onSortChange={handleSortChange} />

      {/* Product grid */}
      {loading ? (
        /* Skeleton loading grid */
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6">
          {Array.from({ length: PRODUCTS_PER_PAGE }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse overflow-hidden rounded-xl border border-gray-100 bg-white p-4"
            >
              <div className="mb-4 aspect-square w-full rounded-lg bg-gray-100" />
              <div className="mb-2 h-4 w-3/4 rounded bg-gray-100" />
              <div className="mb-4 h-3 w-1/2 rounded bg-gray-100" />
              <div className="h-6 w-1/2 rounded bg-gray-100" />
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mt-20 flex flex-col items-center justify-center gap-3 text-center">
          <span className="text-5xl">⚠️</span>
          <p className="text-lg font-semibold text-red-500">Lỗi tải sản phẩm</p>
          <p className="text-sm text-gray-400">{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="mt-20 flex flex-col items-center justify-center gap-3 text-center">
          <span className="text-5xl">🔍</span>
          <p className="text-lg font-semibold text-gray-600">Không tìm thấy sản phẩm phù hợp</p>
          <p className="text-sm text-gray-400">
            Thử thay đổi bộ lọc hoặc{" "}
            <a href="/products" className="text-primary font-medium underline underline-offset-2">
              xem tất cả sản phẩm
            </a>
          </p>
        </div>
      ) : (
        /* 5 cột trên màn hình lớn — tối ưu layout khi không có sidebar */
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 lg:gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}

      <ProductPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </main>
  );
}

// ── Default export: bọc trong Suspense để useSearchParams hoạt động đúng ─────

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <main className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-6 md:px-8 lg:px-12 lg:py-10 xl:px-16">
          <div className="mt-12 flex items-center justify-center text-gray-400">
            Đang tải sản phẩm...
          </div>
        </main>
      }
    >
      <ProductsInner />
    </Suspense>
  );
}
