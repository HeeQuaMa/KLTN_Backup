import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from './schemas/product.schema';

@Injectable()
export class ProductsRepository {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  // Trong file products.repository.ts, sửa lại hàm findAll một chút:
  async findAll(filter: any, sort: any, skip: number, limit: number) {
    return await this.productModel
      .find(filter)
      .populate('category', 'name') // <== THÊM DÒNG NÀY (lấy cột 'name' của bảng Category)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async count(filter: any) {
    return await this.productModel.countDocuments(filter).exec();
  }

  async findById(id: string) {
    return await this.productModel.findById(id).exec();
  }

  async create(data: any) {
    return await this.productModel.create(data);
  }

  async update(id: string, data: any) {
    return await this.productModel
      .findByIdAndUpdate(id, data, { new: true })
      .exec();
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    return !!result;
  }

  async findItemsByProductId(productId: string): Promise<any[]> {
    console.log('Checking items for product:', productId);
    return await Promise.resolve([]);
  }
}
