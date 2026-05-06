import axios from "axios";

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
      const token = localStorage.getItem("admin_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. BẮT LỖI TỪ BACKEND TRẢ VỀ
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;

      // TRƯỜNG HỢP 1: Lỗi 401 - Chưa đăng nhập hoặc Token hết hạn / Sai token
      // -> Bắt buộc phải xóa token và đá văng ra ngoài bắt đăng nhập lại
      if (status === 401) {
        if (typeof window !== "undefined") {
          // THÊM DẤU // ĐỂ ẨN 3 DÒNG NÀY ĐI
          // localStorage.removeItem("admin_token");
          // localStorage.removeItem("admin_info");
          // if (window.location.pathname !== "/admin-login") { window.location.href = "/admin-login"; }
          
          // Thêm dòng này để xem lỗi
          console.error("🚨 [401] Backend không nhận ra Token của bạn!");
        }
      }
      
      // TRƯỜNG HỢP 2: Lỗi 403 - Đã đăng nhập nhưng SAI QUYỀN (Không phải SUPER_ADMIN)
      // -> KHÔNG ĐÁ VĂNG NỮA, chỉ in lỗi ra console để UI tự hứng và hiện Toast
      if (status === 403) {
        console.warn("🚨 [403 Forbidden] Tài khoản của bạn không đủ quyền (SUPER_ADMIN) để xem dữ liệu này.");
      }
    }
    
    // Trả lỗi về cho các file api (như inventoryApi.ts) để nó nhảy vào hàm catch { toast.error(...) }
    return Promise.reject(error);
  }
);

export default axiosInstance;