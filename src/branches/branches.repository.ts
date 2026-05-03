import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Branch } from './schemas/branch.schema';

// Repository chịu trách nhiệm giao tiếp trực tiếp với MongoDB
@Injectable()
export class BranchesRepository {
  constructor(
    @InjectModel(Branch.name) private readonly branchModel: Model<Branch>,
  ) {}

  // Lấy tất cả chi nhánh, có thể lọc theo filter truyền vào
  async findAll(filter: Record<string, unknown> = {}): Promise<Branch[]> {
    return await this.branchModel.find(filter).exec();
  }

  // Tìm một chi nhánh theo ID
  async findById(id: string): Promise<Branch | null> {
    return await this.branchModel.findById(id).exec();
  }

  // Tạo mới một chi nhánh
  async create(data: Partial<Branch>): Promise<Branch> {
    return await this.branchModel.create(data);
  }

  // Cập nhật thông tin chi nhánh theo ID
  async update(id: string, data: Partial<Branch>): Promise<Branch | null> {
    return await this.branchModel
      .findByIdAndUpdate(id, data, { new: true }) // new: true trả về document sau khi cập nhật
      .exec();
  }

  // Xóa chi nhánh theo ID, trả về true nếu xóa thành công
  async delete(id: string): Promise<boolean> {
    const result = await this.branchModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
