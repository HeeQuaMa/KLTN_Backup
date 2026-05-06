import http from "@/lib/axiosInstance";

/**
 * Specifications của sản phẩm — cấu trúc linh hoạt.
 * Laptops: { cpu, vga, ram, storage, display }
 * PC components: { socket, tdp, length, wattage, ramType, height, … }
 */
export type ProductSpecifications = Record<
  string,
  string | number | boolean | string[] | null | undefined
>;

/** Một unit sản phẩm trong kho (ProductItem schema) */
export interface ProductItem {
  _id: string;
  product: string;
  serialNumber: string;
  status: "AVAILABLE" | "SOLD" | "MAINTENANCE";
  createdAt: string;
  updatedAt: string;
}

/** Danh mục sản phẩm (populated khi backend populate) */
export interface ProductCategory {
  _id: string;
  name: string;
  slug: string;
}

/** Tồn theo chi nhánh (inventory=1) */
export interface BranchStockItem {
  branchName: string;
  quantity: number;
}

/** Sản phẩm trả về từ GET /products (danh sách) */
export interface Product {
  _id?: string;
  name?: string;
  brand?: string;
  price?: number;
  importPrice?: number;
  specifications?: ProductSpecifications;
  /** Tồn theo chi nhánh — khi gọi GET /products với inventory=1 */
  branchStocks?: BranchStockItem[];
  // category có thể là ObjectId string HOẶC object được populate
  category?: string | ProductCategory | null;
  totalStock?: number;
  isActive?: boolean;
  description?: string;
  images?: string[];
  sku?: string;
  createdAt?: string;
  updatedAt?: string;
}

/** Sản phẩm trả về từ GET /products/:id (chi tiết, có thêm items) */
export interface ProductDetail extends Product {
  availableItems?: ProductItem[];
}

/** Phân trang trả về từ API */
export interface Pagination {
  total: number;
  page: number;
  pages: number;
}

/** Response của GET /products */
export interface ProductListResponse {
  products: Product[];
  pagination: Pagination;
}

/** Query params cho GET /products */
export interface ProductQueryParams {
  /** Số trang hiện tại (mặc định: 1) */
  page?: number;
  /** Số sản phẩm mỗi trang (mặc định: 10) */
  limit?: number;
  /** Sắp xếp (ví dụ: "price" | "-price" | "name") */
  sort?: string;
  /** Lọc theo CPU (regex, khớp specifications.cpu) */
  cpu?: string;
  /** Lọc theo VGA (regex, khớp specifications.vga) */
  vga?: string;
  /** Giá tối thiểu (VND) */
  minPrice?: number;
  /** Giá tối đa (VND) */
  maxPrice?: number;
  /** Lọc theo thương hiệu (brand field) */
  brand?: string;
  /** Tìm kiếm theo tên sản phẩm (text search) */
  search?: string;
  /** Lọc theo danh mục (category ObjectId hoặc slug) */
  category?: string;
  isActive?: boolean;
  includeHidden?: boolean | string | number;
  /**
   * 1/true: join BranchInventory + Branch; nhận `branchStocks` và `totalStock` đồng bộ với chi nhánh.
   */
  inventory?: string | number | boolean;
}

/**
 * Lấy danh sách sản phẩm (có phân trang, lọc, tìm kiếm)
 * Endpoint: GET /products
 */
export const getProducts = async (
  params: ProductQueryParams = {},
): Promise<ProductListResponse> => {
  // Loại bỏ các params undefined/null/"" để không gửi query rỗng lên server
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, v]) => v !== undefined && v !== null && v !== "",
    ),
  );
  const response = await http.get<ProductListResponse>("/products", {
    params: cleanParams,
  });
  return response.data;
};

export interface UpdateProductPayload {
  name?: string;
  sku?: string;
  brand?: string;
  price?: number;
  importPrice?: number;
  totalStock?: number;
  category?: string;
  description?: string;
  specifications?: ProductSpecifications;
  isActive?: boolean;
}

export const updateProduct = async (
  id: string,
  payload: UpdateProductPayload,
): Promise<Product> => {
  const response = await http.patch<Product>(`/products/${id}`, payload);
  return response.data;
};

export const toggleProductVisibility = async (
  id: string,
  isActive: boolean,
): Promise<Product> => {
  const response = await http.patch<Product>(`/products/${id}`, { isActive });
  return response.data;
};

/** GET /products?inventory=1 — bảng Quản lý kho (importPrice + branchStocks). */
export const getProductsForInventoryAdmin = async (
  params: Omit<ProductQueryParams, "inventory"> = {},
): Promise<ProductListResponse> => {
  return getProducts({
    ...params,
    inventory: "1",
    includeHidden: "1",
    limit: params.limit ?? 300,
    page: params.page ?? 1,
  });
};

/**
 * Lấy chi tiết một sản phẩm theo ID
 * Endpoint: GET /products/:id
 */
export const getProductById = async (id: string): Promise<ProductDetail> => {
  const response = await http.get<ProductDetail>(`/products/${id}`);
  return response.data;
};

/**
 * Tạo sản phẩm kèm ảnh → POST /products/multipart (multipart/form-data).
 */
export interface CreateProductWithImagesPayload {
  name: string;
  sku: string;
  brand?: string;
  categorySlug: string;
  description?: string;
  price: number;
  importPrice?: number;
  totalStock?: number;
  specifications?: ProductSpecifications;
}

export async function createProductWithImages(
  payload: CreateProductWithImagesPayload,
  imageFiles: File[],
): Promise<Product> {
  const fd = new FormData();
  fd.append("name", payload.name);
  fd.append("sku", payload.sku);
  if (payload.brand?.trim()) fd.append("brand", payload.brand.trim());
  fd.append("categorySlug", payload.categorySlug);
  if (payload.description?.trim()) {
    fd.append("description", payload.description.trim());
  }
  fd.append("price", String(payload.price));
  if (payload.importPrice !== undefined && payload.importPrice !== null) {
    fd.append("importPrice", String(payload.importPrice));
  }
  fd.append("totalStock", String(payload.totalStock ?? 0));
  const specs = payload.specifications;
  if (specs && Object.keys(specs).length > 0) {
    fd.append("specifications", JSON.stringify(specs));
  }
  imageFiles.forEach((f) => fd.append("images", f));

  const response = await http.post<Product>("/products/multipart", fd);
  return response.data;
}

/** GET /categories — dropdown khi tạo SP. */
export interface CategoryOption {
  _id: string;
  name: string;
  slug: string;
}

export const getCategories = async (): Promise<CategoryOption[]> => {
  const response = await http.get<CategoryOption[]>("/categories");
  return response.data;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Trích xuất tên danh mục từ field category (có thể là string ID hoặc object).
 */
export const getCategoryName = (
  category: Product["category"],
): string | null => {
  if (!category) return null;
  if (typeof category === "object" && "name" in category) return category.name;
  return null;
};

/**
 * Tự động tạo chuỗi specs từ bất kỳ cấu trúc specifications nào.
 *
 * Thứ tự ưu tiên:
 *  1. Laptop fields: cpu → vga/ram → storage
 *  2. PC component fields: socket + ramType, cores, wattage, length, height, capacity
 *  3. Fallback: lấy 2 giá trị đầu tiên không null/rỗng
 */
export const extractSpecs = (
  specs: ProductSpecifications | undefined | null,
  brand?: string,
): string => {
  if (!specs) return brand ?? "";

  const s = specs;
  const parts: string[] = [];

  // — Laptop / notebook fields —
  if (s.cpu) parts.push(String(s.cpu));
  if (s.vga) parts.push(String(s.vga));
  else if (s.ram) parts.push(String(s.ram));
  if (parts.length >= 2) return parts.join(" / ");

  // — CPU fields —
  if (s.cores) parts.push(`${s.cores} nhân`);
  if (s.boostClock) parts.push(`Boost ${s.boostClock}`);
  if (s.socket) parts.push(`Socket ${s.socket}`);
  if (parts.length >= 2) return parts.join(" / ");

  // — GPU fields —
  if (s.vram) parts.push(String(s.vram));
  if (s.boostClock && !parts.length) parts.push(`${s.boostClock}`);
  if (parts.length >= 1 && s.tdp) parts.push(`TDP ${s.tdp}W`);
  if (parts.length >= 2) return parts.join(" / ");

  // — RAM / SSD fields —
  if (s.capacity) parts.push(String(s.capacity));
  if (s.speed) parts.push(String(s.speed));
  if (s.ramType && !s.capacity) parts.push(String(s.ramType));
  if (parts.length >= 2) return parts.join(" / ");

  // — PSU fields —
  if (s.wattage) parts.push(`${s.wattage}W`);
  if (s.efficiency) parts.push(String(s.efficiency));
  if (parts.length >= 2) return parts.join(" / ");

  // — Mainboard / Case / Cooler fields —
  if (s.formFactor) parts.push(String(s.formFactor));
  if (s.height) parts.push(`Cao ${s.height}mm`);
  if (s.maxGPULength) parts.push(`GPU tối đa ${s.maxGPULength}mm`);
  if (parts.length >= 1) return parts.join(" / ");

  // — Generic fallback: lấy 2 giá trị đầu không null —
  const fallback = Object.values(s)
    .filter((v) => v !== null && v !== undefined && !Array.isArray(v))
    .slice(0, 2)
    .map(String);
  if (fallback.length) return fallback.join(" / ");

  return brand ?? "";
};

/**
 * Map dữ liệu từ backend sang format mà ProductCard hiểu.
 * An toàn với mọi cấu trúc — dùng optional chaining toàn bộ.
 */
export const mapProductToCard = (product: Product) => {
  return {
    id: product?._id ?? "",
    name: product?.name ?? "Sản phẩm không có tên",
    specs: extractSpecs(product?.specifications, product?.brand),
    price: product?.price ?? 0,
    originalPrice: null,
    discount: null,
    image: product?.images?.[0] ?? null,
    brand: product?.brand ?? "",
    categoryName: getCategoryName(product?.category),
    totalStock: product?.totalStock ?? 0,
  };
};
