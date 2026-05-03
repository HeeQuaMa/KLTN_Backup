/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { ProductsRepository } from './products.repository';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class ProductsService {
  constructor(
    private readonly productRepository: ProductsRepository,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(query: any = {}): Promise<any> {
    const {
      page = 1,
      limit = 10,
      sort,
      cpu,
      vga,
      minPrice,
      maxPrice,
      brand,
      search,
      category,
    } = query;
    const filter: any = {};

    // Lọc theo specifications
    if (cpu) filter['specifications.cpu'] = new RegExp(String(cpu), 'i');
    if (vga) filter['specifications.vga'] = new RegExp(String(vga), 'i');

    // Lọc theo thương hiệu (case-insensitive)
    if (brand) filter.brand = new RegExp(String(brand), 'i');

    // Tìm kiếm theo tên sản phẩm (text search)
    if (search) filter.name = new RegExp(String(search), 'i');

    // Lọc theo danh mục — hỗ trợ ObjectId + slug (+ alias như gpu→vga, ssd-hdd→ssd khớp với mega menu/home)
    const CATEGORY_SLUG_ALIASES: Record<string, string> = {
      gpu: 'vga',
      'ssd-hdd': 'ssd',
      hdd: 'ssd',
      'o-cung-ssd-hdd': 'ssd',
    };

    function resolveCategorySlug(raw: string): string {
      const key = raw.trim().toLowerCase();
      return CATEGORY_SLUG_ALIASES[key] ?? key;
    }

    if (category) {
      if (Types.ObjectId.isValid(String(category))) {
        // Đây là ObjectId hợp lệ → cast sang ObjectId để Mongoose khớp chính xác
        filter.category = new Types.ObjectId(String(category));
      } else {
        // Đây là slug (ví dụ: "cpu", "vga", alias "gpu") → tra cứu Category để lấy _id
        try {
          const slugResolved = resolveCategorySlug(String(category));
          const cat = await this.categoriesService.findBySlug(slugResolved);
          filter.category = (cat as any)._id;
        } catch {
          // Slug không tồn tại → trả về rỗng (không lọc gì)
          return {
            products: [],
            pagination: { total: 0, page: Number(page), pages: 0 },
          };
        }
      }
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const skip = (Number(page) - 1) * Number(limit);

    const products = await this.productRepository.findAll(
      filter,
      sort,
      skip,
      Number(limit),
    );
    const total = await this.productRepository.count(filter);

    return {
      products,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async findOne(id: string): Promise<any> {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Không tìm thấy sản phẩm!');

    const items = await this.productRepository.findItemsByProductId(id);
    const productData = (product as any).toObject
      ? product.toObject()
      : product;
    return {
      ...productData,
      availableItems: items.filter((item: any) => item.status === 'AVAILABLE'),
      totalInStock: (product as any).totalStock || 0,
    };
  }

  async create(productData: any) {
    if (!productData.sku) {
      productData.sku = `SKU-${Date.now()}`;
    }
    return await this.productRepository.create(productData);
  }

  async update(id: string, updateData: any) {
    const updatedProduct = await this.productRepository.update(id, updateData);
    if (!updatedProduct) {
      throw new NotFoundException('Không tìm thấy sản phẩm để cập nhật!');
    }
    return updatedProduct;
  }

  async updateStock(id: string, quantityChange: number) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new NotFoundException('Sản phẩm không tồn tại!');

    const currentStock = (product as any).totalStock || 0;
    const newStock = currentStock + quantityChange;

    if (newStock < 0) {
      throw new BadRequestException(
        `Kho không đủ! Hiện tại chỉ còn ${currentStock} sản phẩm.`,
      );
    }

    return await this.productRepository.update(id, { totalStock: newStock });
  }

  async remove(id: string) {
    const result = await this.productRepository.delete(id);
    if (!result) throw new NotFoundException('Không tìm thấy sản phẩm để xóa!');
    return { message: 'Xóa sản phẩm thành công!' };
  }
}
