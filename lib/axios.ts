import axios from "axios";

// Khởi tạo một instance cố định của axios
// Tất cả các request sau này gọi qua http.get() sẽ tự động dùng baseURL này
const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001",
  headers: {
    "Content-Type": "application/json",
  },
  // Bạn có thể sau này thêm timeout, withCredentials... ở đây
});

// Bạn có thể chêm thêm các Interceptor ở đây sau (như tự động gắn Token)
http.interceptors.request.use((config) => {
  // Chỉ chạy trên client side vì localStorage không có trên server
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default http;
