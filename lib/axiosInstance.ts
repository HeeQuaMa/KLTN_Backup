import axios from "axios";

const PUBLIC_PATH_PREFIXES = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/products",
  "/category",
  "/build-pc",
  "/cart",
  "/checkout",
  "/khuyen-mai",
];

const isPublicPath = (path: string): boolean => {
  if (path === "/") return true;
  return PUBLIC_PATH_PREFIXES.some((prefix) =>
    prefix === "/" ? false : path.startsWith(prefix),
  );
};

const axiosInstance = axios.create({
  // Nhớ ưu tiên trỏ đúng cổng Backend (thường là 3001)
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. TỰ ĐỘNG GẮN TOKEN TRƯỚC KHI GỬI ĐI
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      const isAdminArea = path.startsWith("/super-admin") || path.startsWith("/admin");
      const cookieToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("admin-token="))
        ?.split("=")[1];
      const token = isAdminArea
        ? localStorage.getItem("admin_token") || cookieToken || localStorage.getItem("access_token")
        : localStorage.getItem("access_token") || localStorage.getItem("admin_token") || cookieToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // Let browser set proper multipart boundary automatically for FormData payloads
    if (typeof FormData !== "undefined" && config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. BẮT LỖI TỪ BACKEND TRẢ VỀ
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn("[API Warning]", error?.response?.data || error.message);
    if (error.response) {
      const status = error.response.status;

      // TRƯỜNG HỢP 1: Lỗi 401 - Chưa đăng nhập hoặc Token hết hạn / Sai token
      // -> Bắt buộc phải xóa token và đá văng ra ngoài bắt đăng nhập lại
      if (status === 401) {
        if (typeof window !== "undefined") {
          const path = window.location.pathname;
          if (!isPublicPath(path)) {
            console.warn("🚨 [401] Backend không nhận ra Token của bạn!");
          }
        }
      }
      
      // TRƯỜNG HỢP 2: Lỗi 403 - Đã đăng nhập nhưng SAI QUYỀN (Không phải SUPER_ADMIN)
      // -> KHÔNG ĐÁ VĂNG NỮA, chỉ in lỗi ra console để UI tự hứng và hiện Toast
      if (status === 403) {
        console.warn("🚨 [403 Forbidden] Tài khoản của bạn không đủ quyền (SUPER_ADMIN) để xem dữ liệu này.");
      }
    }
    
    return Promise.reject(error);
  }
);

export default axiosInstance;