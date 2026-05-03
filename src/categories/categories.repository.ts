import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Category } from './schemas/category.schema';

@Injectable()
export class CategoriesRepository {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: Model<Category>,
  ) {}

  async findAll() {
    return await this.categoryModel.find({ isDeleted: false }).exec();
  }

  async findById(id: string) {
    return await this.categoryModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
  }

  async findBySlug(slug: string) {
    return await this.categoryModel
      .findOne({ slug, isDeleted: false })
      .exec();
  }

  async create(categoryData: any) {
    const newCategory = new this.categoryModel(categoryData);
    return await newCategory.save();
  }

  async update(id: string, updateData: any) {
    return await this.categoryModel
      .findOneAndUpdate({ _id: id, isDeleted: false }, updateData, {
        new: true,
      })
      .exec();
  }

  async delete(id: string) {
    // Xóa mềm: Chuyển cờ isDeleted thành true
    return await this.categoryModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
  }
}
