import http from "@/lib/axios";
import { Product } from "@/features/storefront/products/utils/mockData";
import { DetailedProduct } from "@/features/storefront/products/utils/mockProductDetail";
import mockAvt from "@/public/images/pink.jpg";

// Mapping tạm thời id category bên backend sang slug cho FE
const categorySlugMap: Record<string, string> = {
  "65af20000000000000000001": "cpu",
  "65af3000f123456789abcdef": "cpu",
  "65af20000000000000000002": "vga",
  "65af20000000000000000003": "mainboard",
  "65af20000000000000000008": "laptop-gaming",
  "65af20000000000000000007": "ssd-hdd",
};

export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await http.get(`/products`);
    
    // API backend trả về danh sách trong response.data.products
    const products = response.data.products || [];

    return products.map((item: any) => {
      // Map specs sang string hiển thị
      let specsStr = "N/A";
      if (item.specifications) {
        specsStr = Object.values(item.specifications).join(" / ");
      }

      const price = item.price || item.basePrice || 0;
      
      const mappedSlug =
        categorySlugMap[item.categoryId || item.category] ||
        item.categorySlug ||
        "all";

      return {
        id: item._id || item.id,
        name: item.name,
        specs: specsStr,
        price: price,
        originalPrice: item.basePrice ? price * 1.05 : null, // Mock original price nếu cần
        discount: null,
        image: item.images && item.images.length > 0 ? item.images[0] : mockAvt,
        categorySlug: mappedSlug,
        brand: item.brand || "Unknown",
        totalStock: item.totalStock || 0,
        sku: item.sku || "",
      };
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};

export const getProductById = async (id: string): Promise<DetailedProduct | null> => {
  try {
    const response = await http.get(`/products/${id}`);
    const item = response.data; // Giả sử Backend trả thẳng object product ở root data

    if (!item) return null;

    const basePrice = item.price || item.basePrice || 0;

    return {
      id: item._id || item.id,
      name: item.name,
      sku: item.sku || "N/A",
      availability: (item.totalStock && item.totalStock > 0) ? "In Stock" : "Out of Stock",
      basePrice,
      originalPrice: item.basePrice ? basePrice * 1.05 : null,
      discount: null,
      images: item.images?.length ? item.images : [mockAvt],
      configurations: item.configurations?.length 
        ? item.configurations 
        : [{ id: "default", name: "Mặc định", priceDelta: 0 }],
      features: item.features || [],
      specs: item.specifications || {},
      highlights: item.shortHighlights || [],
    };
  } catch (error) {
    console.error(`Error fetching product ID ${id}:`, error);
    return null;
  }
};
