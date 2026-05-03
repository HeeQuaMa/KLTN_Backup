import { Injectable, NotFoundException } from '@nestjs/common';
import { BranchesRepository } from './branches.repository';
import { Branch, BranchStatus } from './schemas/branch.schema';

// Service chứa logic nghiệp vụ, Controller gọi vào đây, không gọi thẳng Repository
@Injectable()
export class BranchesService {
  constructor(private readonly branchesRepository: BranchesRepository) {}

  // Lấy toàn bộ chi nhánh (mặc định chỉ lấy chi nhánh đang hoạt động)
  async findAll(onlyActive = false): Promise<Branch[]> {
    const filter = onlyActive ? { status: BranchStatus.ACTIVE } : {};
    return await this.branchesRepository.findAll(filter);
  }

  // Lấy chi tiết một chi nhánh theo ID
  async findOne(id: string): Promise<Branch> {
    const branch = await this.branchesRepository.findById(id);
    if (!branch) throw new NotFoundException('Không tìm thấy chi nhánh!');
    return branch;
  }

  // Tạo mới chi nhánh
  async create(data: Partial<Branch>): Promise<Branch> {
    return await this.branchesRepository.create(data);
  }

  // Cập nhật thông tin chi nhánh
  async update(id: string, data: Partial<Branch>): Promise<Branch> {
    const updated = await this.branchesRepository.update(id, data);
    if (!updated)
      throw new NotFoundException('Không tìm thấy chi nhánh để cập nhật!');
    return updated;
  }

  // Xóa chi nhánh
  async remove(id: string): Promise<{ message: string }> {
    const deleted = await this.branchesRepository.delete(id);
    if (!deleted)
      throw new NotFoundException('Không tìm thấy chi nhánh để xóa!');
    return { message: 'Xóa chi nhánh thành công!' };
  }
}
