import {
  Injectable,
  ConflictException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  // =======================================================
  // 1. NHÓM API LẤY DỮ LIỆU (GET)
  // =======================================================

  async findAll() {
    return await this.userRepository.findAll();
  }

  async getStaffList(query: any) {
    const staffs = await this.userRepository.findStaffList(query);
    return {
      success: true,
      data: staffs,
      total: staffs.length,
    };
  }

  async getCustomerList(query: any) {
    const { page = 1, limit = 10, search, tier, status } = query;
    const skip = (Number(page) - 1) * Number(limit);
    
    // ✅ BƯỚC QUAN TRỌNG NHẤT: Dựng "tường lửa", CHỈ cho phép lấy Khách hàng
    const filter: any = {
      role: { $in: ['CUSTOMER', 'Customer', null] }
    };

    if (status === 'LOCKED') filter.isDeleted = true;
    else if (status === 'ACTIVE') filter.isDeleted = { $ne: true };

    if (search) {
      filter.$or = [
        { fullName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
      ];
    }

    if (tier && tier !== 'all') {
      filter.tier = tier;
    }

    const [data, totalItems] = await Promise.all([
      this.userRepository.findCustomersWithPagination(filter, skip, Number(limit)),
      this.userRepository.countCustomers(filter), // Hàm count cũng sẽ tự động đếm theo filter này
    ]);

    return {
      data,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        totalItems,
        totalPages: Math.ceil(totalItems / Number(limit)),
      },
    };
  }

  async getCustomerStats() {
    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalMembers, newThisMonth, newLastMonth, vipMembers] =
      await Promise.all([
        this.userRepository.countCustomers(),
        this.userRepository.countCustomers({
          createdAt: { $gte: startOfThisMonth },
        }),
        this.userRepository.countCustomers({
          createdAt: { $gte: startOfLastMonth, $lt: startOfThisMonth },
        }),
        this.userRepository.countCustomers({
          tier: { $in: ['Gold', 'Platinum'] },
        }),
      ]);

    let trendPercent = 0;
    if (newLastMonth > 0) {
      trendPercent = ((newThisMonth - newLastMonth) / newLastMonth) * 100;
    } else if (newThisMonth > 0) {
      trendPercent = 100;
    }

    return {
      totalMembers,
      newThisMonth: {
        count: newThisMonth,
        trend: trendPercent >= 0 ? 'up' : 'down',
        trendText: `${Math.abs(Math.round(trendPercent))}% so với tháng trước`,
      },
      vipMembers,
    };
  }

  // =======================================================
  // 2. NHÓM API TẠO MỚI & CẬP NHẬT
  // =======================================================

  async create(createUserDto: any) {
    console.log('🔥 DỮ LIỆU NHẬN ĐƯỢC:', createUserDto);

    if (!createUserDto.email) {
      throw new BadRequestException('Email là bắt buộc!');
    }

    const emailToSave = createUserDto.email.trim().toLowerCase();

    // 1. Kiểm tra trùng email
    const emailExists = await this.userRepository.findByEmail(emailToSave);
    if (emailExists) throw new ConflictException('Email đã tồn tại!');

    // 2. Hash mật khẩu
    const hashedPassword = await bcrypt.hash(createUserDto.password || 'Nettech@123', 10);

    // 3. Xử lý hạng thẻ (Chỉ gán nếu là khách hàng, và ép Enum chuẩn)
    const isCustomer = !createUserDto.role || createUserDto.role === 'CUSTOMER';
    let tierToSave = undefined;
    
    if (isCustomer) {
      tierToSave = createUserDto.initialTier?.includes('Member') 
        ? 'Member' 
        : (createUserDto.initialTier || 'Member');
    }

    // 4. Chuẩn bị dữ liệu lưu vào DB
    const newUser = {
      ...createUserDto,
      email: emailToSave,
      password: hashedPassword,
      isDeleted: false,
      role: createUserDto.role || 'CUSTOMER', 
      tier: tierToSave,
    };

    return await this.userRepository.create(newUser);
  }

  async update(id: string, updateData: any) {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const updated = await this.userRepository.update(id, updateData);
    if (!updated) {
      throw new NotFoundException('Không tìm thấy tài khoản để cập nhật!');
    }
    return updated;
  }

  async toggleLock(id: string) {
    const user = await this.userRepository.findByIdWithDeleted(id);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng!');
    return await this.userRepository.updateWithDeleted(id, {
      isDeleted: !user.isDeleted,
    });
  }

  // =======================================================
  // 3. CÁC HÀM HỖ TRỢ KHÁC
  // =======================================================

  async findOne(id: string) {
    const user = await this.userRepository.findByIdWithDeleted(id);
    if (!user) throw new NotFoundException('Không tìm thấy người dùng!');
    return user;
  }

  async remove(id: string) {
    const deleted = await this.userRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Không tìm thấy tài khoản để xóa!');
    }
    return { message: 'Đã xóa tài khoản thành công!' };
  }
}