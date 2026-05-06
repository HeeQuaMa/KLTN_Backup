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
      isActive,
      includeHidden,
    } = query;
    const filter: any = {};

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(Math.max(1, Number(limit) || 10), 500);

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
            pagination: { total: 0, page: pageNum, pages: 0 },
          };
        }
      }
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const shouldIncludeHidden =
      includeHidden === true ||
      includeHidden === 'true' ||
      includeHidden === 1 ||
      includeHidden === '1';

    if (
      isActive !== undefined &&
      isActive !== null &&
      isActive !== '' &&
      isActive !== 'all'
    ) {
      if (isActive === true || isActive === 'true') filter.isActive = true;
      else if (isActive === false || isActive === 'false')
        filter.isActive = false;
    } else if (!shouldIncludeHidden) {
      // Storefront should only see active products by default.
      filter.isActive = true;
    }

    const skip = (pageNum - 1) * limitNum;

    const products = await this.productRepository.findAll(
      filter,
      sort,
      skip,
      limitNum,
    );
    const total = await this.productRepository.count(filter);

    return {
      products,
      pagination: {
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum) || 1,
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

  private parseSpecifications(
    raw: unknown,
  ): Record<string, unknown> | undefined {
    if (raw == null || raw === '') return undefined;
    if (typeof raw === 'object' && raw !== null && !Array.isArray(raw)) {
      return raw as Record<string, unknown>;
    }
    if (typeof raw !== 'string') return undefined;
    try {
      const parsed = JSON.parse(raw) as unknown;
      return typeof parsed === 'object' &&
        parsed !== null &&
        !Array.isArray(parsed)
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }

  private async resolveCategoryId(data: Record<string, unknown>): Promise<void> {
    const raw = data['categorySlug'] ?? data['category'];
    delete data['categorySlug'];

    if (raw == null || String(raw).trim() === '') {
      throw new BadRequestException(
        'Thiếu danh mục (categorySlug hoặc category ObjectId).',
      );
    }

    const s = String(raw).trim();

    if (Types.ObjectId.isValid(s) && s.length === 24) {
      data.category = new Types.ObjectId(s);
      return;
    }

    const cat = await this.categoriesService.findBySlug(s);
    data.category = (cat as { _id: Types.ObjectId })._id;
  }

  /**
   * POST /products/multipart — text fields + uploaded file URLs in `images`.
   */
  async createFromMultipart(input: Record<string, unknown>) {
    const data: Record<string, unknown> = { ...input };

    const spec = data.specifications;
    const parsedSpec = this.parseSpecifications(spec);
    if (parsedSpec !== undefined) {
      data.specifications = parsedSpec;
    }

    if (typeof data.images === 'string') {
      try {
        data.images = JSON.parse(data.images as string);
      } catch {
        data.images = [];
      }
    }
    if (!Array.isArray(data.images)) {
      data.images = [];
    }

    await this.resolveCategoryId(data);

    const rawPrice = data.price;
    if (rawPrice === undefined || String(rawPrice).trim() === '') {
      throw new BadRequestException('Giá bán (price) không hợp lệ.');
    }
    const p = Number(rawPrice);
    if (!Number.isFinite(p)) {
      throw new BadRequestException('Giá bán (price) không hợp lệ.');
    }
    data.price = p;

    const rawIp = data.importPrice;
    if (
      rawIp !== undefined &&
      rawIp !== null &&
      String(rawIp).trim() !== ''
    ) {
      const ip = Number(rawIp);
      if (!Number.isFinite(ip)) {
        throw new BadRequestException('Giá nhập (importPrice) không hợp lệ.');
      }
      data.importPrice = ip;
    } else {
      delete data.importPrice;
    }

    const rawTs = data.totalStock;
    if (rawTs === undefined || rawTs === null || String(rawTs).trim() === '') {
      data.totalStock = 0;
    } else {
      const ts = Number(rawTs);
      if (!Number.isFinite(ts)) {
        throw new BadRequestException('Tồn kho không hợp lệ.');
      }
      data.totalStock = ts;
    }

    if (!data.name || String(data.name).trim() === '')
      throw new BadRequestException('Tên sản phẩm là bắt buộc.');

    if (!data['sku']) {
      data.sku = `SKU-${Date.now()}`;
    }
    if (
      data.importPrice == null &&
      data.price != null &&
      Number.isFinite(Number(data.price))
    ) {
      data.importPrice = Math.round(Number(data.price) * 0.75);
    }

    data.brand =
      data['brand'] && String(data['brand']).trim() !== ''
        ? String(data['brand']).trim()
        : 'Không rõ';

    if (data.description == null) data.description = '';

    if (data.isActive === undefined) data.isActive = true;

    return await this.productRepository.create(data);
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
