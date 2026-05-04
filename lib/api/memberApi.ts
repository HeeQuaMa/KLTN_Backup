// lib/api/memberApi.ts
import axiosInstance from "../axiosInstance"; 

export interface Member {
  _id: string;
  memberCode: string;
  fullName: string;
  email: string;
  phone: string;
  tier: string;
  totalSpent: number;
  createdAt: string;
  isDeleted?: boolean;
}

export interface MemberStats {
  totalMembers: number;
  newThisMonth: {
    count: number;
    trend: "up" | "down" | "none";
    trendText: string;
  };
  vipMembers: number;
}

// Hàm lấy 3 thẻ thống kê
export const getMemberStats = async (): Promise<MemberStats> => {
  const response = await axiosInstance.get("/users/customers/stats");
  return response.data;
};

// Hàm lấy danh sách bảng (hỗ trợ phân trang, tìm kiếm)
export const getMembers = async (params: {
  page?: number;
  limit?: number;
  search?: string;
  tier?: string;
  status?: string;
}) => {
  const response = await axiosInstance.get("/users/customers/list", { params });
  return response.data; 
};