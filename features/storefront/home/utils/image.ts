const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001").replace(
  /\/$/,
  "",
);

/** Chuẩn hóa ảnh: chỉ cho phép local `/...` hoặc backend `/uploads/...`. */
export function resolveHomeImageUrl(
  raw: string | null | undefined,
  fallback: string,
): string {
  const src = (raw || "").trim();
  if (!src) return fallback;
  if (src.startsWith("/uploads/")) return `${API_BASE}${src}`;
  if (src.startsWith("/")) return src;
  return fallback;
}

export const HOME_IMAGE_FALLBACKS = {
  heroLaptop: "/globe.svg",
  heroBuildPc: "/next.svg",
  heroRtx4090: "/window.svg",
  miniRtx4090: "/window.svg",
  miniBuildPc: "/file.svg",
  categoryVga: "/window.svg",
  aiBanner: "/next.svg",
} as const;
