import axiosInstance from "@/lib/axiosInstance";

export interface DashboardPeriod {
  year: number;
  month: number;
  label: string;
}

export interface DashboardStats {
  period: DashboardPeriod;
  lowStockThreshold: number;
  totalRevenue: number;
  totalRevenueGrowthPercent: number;
  totalOrders: number;
  totalOrdersGrowthPercent: number;
  newCustomers: number;
  newCustomersGrowthPercent: number;
  lowStockProducts: number;
}

export interface RevenueChartWeek {
  label: string;
  online: number;
  offline: number;
}

export interface RevenueChartResponse {
  year: number;
  month: number;
  weeks: RevenueChartWeek[];
}

export interface TopProductRow {
  rank: number;
  productId: string | null;
  name: string;
  soldQuantity: number;
}

export interface RecentOrderRow {
  orderCode: string;
  customerName: string;
  createdAt: string;
  totalAmount: number;
  status: string;
  statusLabel: string;
  channel: string;
  channelLabel: string;
}

const params = (year: number, month: number) => ({ year, month });

export async function fetchDashboardStats(year: number, month: number) {
  const { data } = await axiosInstance.get<DashboardStats>("/dashboard/stats", {
    params: params(year, month),
  });
  return data;
}

export async function fetchRevenueChart(year: number, month: number) {
  const { data } = await axiosInstance.get<RevenueChartResponse>(
    "/dashboard/revenue-chart",
    { params: params(year, month) },
  );
  return data;
}

export async function fetchTopProducts(year: number, month: number) {
  const { data } = await axiosInstance.get<{ products: TopProductRow[] }>(
    "/dashboard/top-products",
    { params: params(year, month) },
  );
  return data.products;
}

export async function fetchRecentOrders(year: number, month: number) {
  const { data } = await axiosInstance.get<{ orders: RecentOrderRow[] }>(
    "/dashboard/recent-orders",
    { params: params(year, month) },
  );
  return data.orders;
}
