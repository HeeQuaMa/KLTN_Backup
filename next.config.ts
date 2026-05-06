import type { NextConfig } from "next";
import path from "node:path";
import { fileURLToPath } from "node:url";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));

/** Chuẩn Next `remotePatterns` — `pathname` rộng cho CDN có query/hash. */
function rp(hostname: string) {
  return {
    protocol: "https" as const,
    hostname,
    port: "",
    pathname: "/**",
  };
}

/**
 * CDN & provider bundles (kéo được nhiều subdomain trong seed).
 *
 * **`**.vn`** bao phủ mọi host kết thúc `.vn` (vd. `anphat.com.vn`, `cdn.tgdd.vn`,
 * `tmp.phongvu.vn`, …). Tránh lặp rule riêng cho từng subdomain VN.
 */
const imageRemotePatternsWildcard: ReturnType<typeof rp>[] = [
  rp("**.hstatic.net"),
  rp("**.tgdd.vn"),
  rp("**.static.pub"),
  rp("**.pcmag.com"),
  rp("**.media-amazon.com"),
  rp("**.ssl-images-amazon.com"),
  rp("**.dktcdn.net"),
  rp("**.futurecdn.net"),
  rp("**.neweggimages.com"),
  rp("**.ebayimg.com"),
  rp("**.ytimg.com"),
  rp("**.gnwcdn.com"),
  rp("**.tn-cdn.net"),
  rp("**.asus.com"),
  rp("**.nvidia.com"),
  rp("**.hungphatlaptop.com"),
  rp("**.vn"),
];

/**
 * Host quốc tế / gTLD không gói gọn được bằng `**.vn`
 * — rút từ quét `img('https://…')` trong backend seed (130 SKU).
 */
const imageRemotePatternsExplicit = [
  rp("studentcomputers.co.uk"),
  rp("bizweb.dktcdn.net"),
  rp("lh6.googleusercontent.com"),
  rp("cdn.cybassets.com"),
  rp("ecommerce.datablitz.com.ph"),
  rp("hanoicomputercdn.com"),
  rp("i.rtings.com"),
  rp("laptop360.net"),
  rp("laptopmedia.com"),
  rp("minhancomputercdn.com"),
  rp("pcper.com"),
  rp("phanteks.com"),
  rp("phucanhcdn.com"),
  rp("storage.tweak.dk"),
  rp("tpucdn.com"),
  rp("www.alktech.co"),
  rp("www.cnet.com"),
  rp("www.ukgamingcomputers.co.uk"),
];

/** UI trong repo (banner, placeholder) — không nằm trong seed XML. */
const imageRemotePatternsUi = [
  rp("images.unsplash.com"),
  rp("placehold.co"),
  rp("**.cloudinary.com"),
  rp("**.imgur.com"),
];

/** API local (`http://localhost:3001/uploads/...`) cho ảnh upload từ backend. */
const imageRemotePatternsLocalApi = [
  {
    protocol: "http" as const,
    hostname: "localhost",
    port: "3001",
    pathname: "/uploads/**" as const,
  },
  {
    protocol: "http" as const,
    hostname: "127.0.0.1",
    port: "3001",
    pathname: "/uploads/**" as const,
  },
];

const imageRemotePatterns: Array<
  ReturnType<typeof rp> | (typeof imageRemotePatternsLocalApi)[number]
> = [
  ...imageRemotePatternsWildcard,
  ...imageRemotePatternsExplicit,
  ...imageRemotePatternsUi,
  ...imageRemotePatternsLocalApi,
];

const backendUrl = process.env.NEXT_PUBLIC_API_URL;
if (backendUrl) {
  try {
    const u = new URL(backendUrl);
    const backendPattern = {
      protocol: (u.protocol.replace(":", "") || "http") as "http" | "https",
      hostname: u.hostname,
      port: u.port,
      pathname: "/uploads/**" as const,
    };
    imageRemotePatterns.push(backendPattern);
  } catch {
    // Ignore malformed NEXT_PUBLIC_API_URL and keep default patterns.
  }
}

const nextConfig: NextConfig = {
  /**
   * Khi tool lầm `./app` làm root: parent của `app/` = thư mục gói (trùng `frontendRoot`).
   */
  turbopack: {
    root: frontendRoot,
  },
  images: {
    remotePatterns: imageRemotePatterns,
  },
};

export default nextConfig;
