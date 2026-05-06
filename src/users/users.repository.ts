import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
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
      .select('+password _id email phone username fullName role isDeleted')
      .lean()
      .exec();

    // Chặn nếu user đã bị xóa mềm
    if (user && user.isDeleted === true) return null;

    return user;
  }

  /** 3. Tạo mới User (Đảm bảo luôn có isDeleted = false) */
  async create(userData: any) {
    const newUser = new this.userModel({ ...userData, isDeleted: false });
    return await newUser.save();
  }

  /** 4. Lấy danh sách Khách hàng có phân trang + totalSpent từ orders */
  async findCustomersWithPagination(filter: any, skip: number, limit: number) {
    const finalFilter = {
      ...filter,
      role: { $regex: /^customer$/i },
    };

    if (!('isDeleted' in filter)) {
      finalFilter.isDeleted = { $ne: true };
    }

    return await this.userModel
      .aggregate([
        { $match: finalFilter },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
        {
          $lookup: {
            from: 'orders',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$user', '$$userId'] },
                  status: { $ne: 'CANCELLED' },
                },
              },
              {
                $group: {
                  _id: null,
                  totalSpent: { $sum: { $ifNull: ['$totalAmount', 0] } },
                },
              },
            ],
            as: 'orderSpendAgg',
          },
        },
        {
          $addFields: {
            totalSpent: {
              $ifNull: [
                { $arrayElemAt: ['$orderSpendAgg.totalSpent', 0] },
                { $ifNull: ['$totalSpent', 0] },
              ],
            },
          },
        },
        { $project: { orderSpendAgg: 0, password: 0 } },
      ])
      .exec();
  }

  /** 5. Đếm tổng số khách hàng (Dùng cho Card thống kê và Phân trang) */
  async countCustomers(filter: any = {}) {
    const finalFilter = {
      ...filter,
      role: { $regex: /^customer$/i },
    };

    if (!('isDeleted' in filter)) {
      finalFilter.isDeleted = { $ne: true };
    }

    return await this.userModel.countDocuments(finalFilter).exec();
  }

  /** 6. Lấy danh sách Nhân viên (Chặn Customer) */
  async findStaffList(filter: any) {
    const finalFilter: any = {};

    if (filter.role && filter.role !== 'all') {
      finalFilter.role = filter.role;
    } else {
      finalFilter.role = { $nin: ['Customer', 'CUSTOMER'] };
    }

    if (filter.status === 'ACTIVE') {
      finalFilter.isDeleted = { $ne: true };
    } else if (filter.status === 'LOCKED') {
      finalFilter.isDeleted = true;
    }

    if (filter.keyword) {
      finalFilter.$or = [
        { fullName: { $regex: filter.keyword, $options: 'i' } },
        { email: { $regex: filter.keyword, $options: 'i' } },
        { phone: { $regex: filter.keyword, $options: 'i' } },
      ];
    }

    return await this.userModel
      .find(finalFilter)
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAll() {
    return await this.userModel.find({ isDeleted: { $ne: true } }).exec();
  }

  async findById(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    const objectId = new Types.ObjectId(id);
    const rows = await this.userModel
      .aggregate([
        { $match: { _id: objectId, isDeleted: { $ne: true } } },
        {
          $lookup: {
            from: 'orders',
            let: { userId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: { $eq: ['$user', '$$userId'] },
                  status: { $ne: 'CANCELLED' },
                },
              },
              {
                $group: {
                  _id: null,
                  totalSpent: { $sum: { $ifNull: ['$totalAmount', 0] } },
                },
              },
            ],
            as: 'orderSpendAgg',
          },
        },
        {
          $addFields: {
            totalSpent: {
              $ifNull: [
                { $arrayElemAt: ['$orderSpendAgg.totalSpent', 0] },
                { $ifNull: ['$totalSpent', 0] },
              ],
            },
          },
        },
        { $project: { orderSpendAgg: 0, password: 0 } },
      ])
      .exec();
    return rows[0] ?? null;
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