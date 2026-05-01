import type { NextConfig } from "next";

/**
 * Next.js 16: `images.remotePatterns` tối đa 50 phần tử.
 * Ảnh sản phẩm từ API/seed dùng thẻ <img> (ProductCard, gallery, giỏ…) — không cần khai báo ở đây.
 * Chỉ cần domain cho next/image còn lại: hero, category card, banner (chủ yếu Unsplash).
 */
const imageRemotePatterns: {
  protocol: "https";
  hostname: string;
}[] = [
  { protocol: "https", hostname: "images.unsplash.com" },
  { protocol: "https", hostname: "placehold.co" },
  { protocol: "https", hostname: "**.cloudinary.com" },
  { protocol: "https", hostname: "**.imgur.com" },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: imageRemotePatterns,
  },
};

export default nextConfig;
