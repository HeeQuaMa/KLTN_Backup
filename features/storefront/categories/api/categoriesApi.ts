import http from "@/lib/axios";

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  parent?: string;
}

export const getCategoryBySlug = async (slug: string): Promise<Category | null> => {
  try {
    const response = await http.get(`/categories/slug/${slug}`);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      // Bỏ qua lỗi 404 (Không tìm thấy danh mục) để Next.js không hiện màn hình đỏ
      return null;
    }
    console.error(`Error fetching category with slug ${slug}:`, error.message);
    return null;
  }
};

export const getCategories = async (): Promise<Category[]> => {
  try {
    const response = await http.get(`/categories`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};
