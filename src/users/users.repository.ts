import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  /** 1. Tìm user theo Email (Dùng để check trùng lúc đăng ký) */
  async findByEmail(email: string) {
    return await this.userModel
      .findOne({
        email,
        isDeleted: { $ne: true }, 
      })
      .lean();
  }

  /** 
   * 2. HÀM QUAN TRỌNG NHẤT: Dùng cho Đăng nhập
   * Lấy được cả Password (đã bị ẩn) và hỗ trợ tìm theo Email/SĐT/Username 
   */
  async findByEmailOrPhoneWithPassword(identifier: string) {
    const user = await this.userModel
      .findOne({
        $or: [
          { email: identifier },
          { phone: identifier },
          { username: identifier },
        ],
      })
      .select('+password') // ✅ Ép Mongoose nhả mật khẩu ra để Bcrypt so sánh
      .exec(); // ✅ Dùng .exec() để lấy đầy đủ Instance Mongoose

    // Chặn nếu user đã bị xóa mềm
    if (user && user.isDeleted === true) return null;

    return user;
  }

  /** 3. Tạo mới User (Đảm bảo luôn có isDeleted = false) */
  async create(userData: any) {
    const newUser = new this.userModel({ ...userData, isDeleted: false });
    return await newUser.save();
  }

  /** 4. Lấy danh sách Khách hàng có phân trang & Regex Role */
  async findCustomersWithPagination(filter: any, skip: number, limit: number) {
    const finalFilter = {
      ...filter,
      // ✅ Dùng Regex để bắt cả 'Customer' và 'CUSTOMER'
      role: { $regex: /^customer$/i }, 
    };

    if (!('isDeleted' in filter)) {
      finalFilter.isDeleted = { $ne: true };
    }

    return await this.userModel
      .find(finalFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  /** 5. Đếm tổng số khách hàng (Dùng cho Card thống kê và Phân trang) */
  async countCustomers(filter: any = {}) {
    const finalFilter = {
      ...filter,
      role: { $regex: /^customer$/i }, // ✅ Đảm bảo con số luôn nhảy đúng
    };

    if (!('isDeleted' in filter)) {
      finalFilter.isDeleted = { $ne: true };
    }

    return await this.userModel.countDocuments(finalFilter).exec();
  }

  /** 6. Lấy danh sách Nhân viên (Chặn Customer) */
  async findStaffList(filter: any) {
    const finalFilter: any = {};

    // 1. Lọc Role: Loại bỏ khách hàng để chỉ hiện nhân sự
    if (filter.role && filter.role !== 'all') {
      finalFilter.role = filter.role;
    } else {
      // Đảm bảo không lấy nhầm khách hàng vào danh sách nhân sự
      finalFilter.role = { $nin: ['Customer', 'CUSTOMER'] }; 
    }

    // 2. Lọc theo trạng thái tài khoản
    if (filter.status === 'ACTIVE') {
      finalFilter.isDeleted = { $ne: true };
    } else if (filter.status === 'LOCKED') {
      finalFilter.isDeleted = true;
    }

    // 3. Tìm kiếm theo từ khóa (Tên, Email, hoặc Số điện thoại)
    if (filter.keyword) {
      finalFilter.$or = [
        { fullName: { $regex: filter.keyword, $options: 'i' } },
        { email: { $regex: filter.keyword, $options: 'i' } },
        { phone: { $regex: filter.keyword, $options: 'i' } },
      ];
    }

    // 4. Thực thi truy vấn và trả về kết quả
    return await this.userModel
      .find(finalFilter)
      .sort({ createdAt: -1 }) // Nhân viên mới nhất sẽ hiện lên đầu
      .exec();
  }

  /** ========================================================
   * CÁC HÀM CRUD CƠ BẢN
   * ======================================================== */
  
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

  async findByIdWithDeleted(id: string) {
    return await this.userModel.findById(id).exec();
  }

  async updateWithDeleted(id: string, updateData: any) {
    return await this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }
}