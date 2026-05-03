import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  // 1. Dùng để check trùng lúc đăng ký
  async findByEmail(email: string) {
    return await this.userModel
      .findOne({
        email,
        isDeleted: { $ne: true }, // Sửa từ 'false' thành 'khác true' cho chắc
      })
      .lean();
  }

  // 2. HÀM QUAN TRỌNG NHẤT: Sửa lại logic query ở đây
  async findByEmailOrPhoneWithPassword(identifier: string) {
    return await this.userModel
      .findOne({
        $or: [
          { email: identifier },
          { phone: identifier },
          { username: identifier },
        ],
        isDeleted: { $ne: true }, // Dùng $ne true để lách luật nếu DB chưa có trường này
      })
      .select('+password') // Ép lấy mật khẩu ra để so sánh
      .lean();
  }

  async create(userData: any) {
    // Đảm bảo khi tạo mới luôn có isDeleted = false để sau này query đồng bộ
    const newUser = new this.userModel({ ...userData, isDeleted: false });
    return await newUser.save();
  }

  // ========================================================
  // PHẦN CRUD USERS (Giữ nguyên để Controller không báo lỗi đỏ)
  // ========================================================
  async findAll() {
    return await this.userModel.find({ isDeleted: { $ne: true } }).exec();
  }

  async findById(id: string) {
    return await this.userModel
      .findOne({ _id: id, isDeleted: { $ne: true } })
      .exec();
  }

  async update(id: string, updateData: any) {
    return await this.userModel
      .findOneAndUpdate({ _id: id, isDeleted: { $ne: true } }, updateData, {
        new: true,
      })
      .exec();
  }

  async delete(id: string) {
    return await this.userModel
      .findByIdAndUpdate(id, { isDeleted: true }, { new: true })
      .exec();
  }

  async findCustomersWithPagination(filter: any, skip: number, limit: number) {
    // Ép điều kiện bắt buộc: Phải là CUSTOMER và chưa bị xóa
    const finalFilter = {
      ...filter,
      role: 'CUSTOMER',
      isDeleted: { $ne: true },
    };

    return await this.userModel
      .find(finalFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  // Hàm 2: Đếm số lượng dùng cho phân trang và thống kê
  async countCustomers(filter: any = {}) {
    const finalFilter = {
      ...filter,
      role: 'CUSTOMER',
      isDeleted: { $ne: true },
    };
    return await this.userModel.countDocuments(finalFilter).exec();
  }

  async findStaffList(filter: any) {
    const finalFilter: any = {};

    // 1. XỬ LÝ LỌC THEO VAI TRÒ (Và chặn Customer)
    if (filter.role) {
      finalFilter.role = filter.role; // Nếu user có chọn role cụ thể (VD: Store Manager)
    } else {
      finalFilter.role = { $nin: ['Customer', 'CUSTOMER'] }; // Nếu chọn "Tất cả", chặn hiển thị Customer
    }

    // 2. XỬ LÝ LỌC THEO TRẠNG THÁI (Map 'status' sang 'isDeleted')
    if (filter.status === 'ACTIVE') {
      finalFilter.isDeleted = { $ne: true }; // Tìm những người chưa bị khóa (false hoặc undefined)
    } else if (filter.status === 'LOCKED') {
      finalFilter.isDeleted = true; // Tìm những người đã bị khóa
    }
    // Nếu status là "all" (Tất cả) thì không thêm điều kiện isDeleted, sẽ hiển thị ra hết.

    // 3. XỬ LÝ Ô TÌM KIẾM KEYWORD (Tìm theo Tên hoặc Email)
    if (filter.keyword) {
      finalFilter.$or = [
        { fullName: { $regex: filter.keyword, $options: 'i' } }, // $options: 'i' để không phân biệt hoa thường
        { email: { $regex: filter.keyword, $options: 'i' } },
      ];
    }

    if (filter.branchId) {
      finalFilter.branchId = filter.branchId;
    }

    // 4. Gọi DB
    return await this.userModel
      .find(finalFilter)
      .populate('branchId', 'name')
      .sort({ createdAt: -1 })
      .exec();
  }

  // 1. Tìm user bất chấp trạng thái (Để lấy ra được người đã bị khóa)
  async findByIdWithDeleted(id: string) {
    return await this.userModel.findById(id).exec();
  }

  // 2. Cập nhật user bất chấp trạng thái
  async updateWithDeleted(id: string, updateData: any) {
    return await this.userModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }
}
