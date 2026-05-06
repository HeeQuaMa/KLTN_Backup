import axios from "axios";


const axiosInstance = axios.create({
  // Khớp với BE/src/main.ts (PORT mặc định 3001). Ưu tiên NEXT_PUBLIC_API_URL trong .env.
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// THÊM MỚI ĐOẠN NÀY: Chặn request trước khi gửi đi để đính kèm Token
axiosInstance.interceptors.request.use(
  (config) => {
    // Chỉ lấy localStorage khi code đang chạy trên trình duyệt (tránh lỗi Next.js SSR)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("access_token");
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
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.warn("[API Warning]", error?.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default axiosInstance;
