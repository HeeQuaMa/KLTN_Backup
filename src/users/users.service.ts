import {
  Injectable,
  ConflictException,
  NotFoundException, 
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    private readonly userRepository: UsersRepository,
    // Đã xóa JwtService ở đây vì việc cấp Token chuyển sang AuthService
  ) {}

  // ========================================================
  // Đã xóa hàm register và login (Chuyển sang auth.service.ts)
  // ========================================================

  async getCustomerList(query: any) {
    const { page = 1, limit = 10, search, tier, status } = query;
    const skip = (Number(page) - 1) * Number(limit);
    const filter: any = {};

    // 2. THÊM LOGIC LỌC TRẠNG THÁI (LOCKED / ACTIVE)
    if (status === 'LOCKED') {
      filter.isDeleted = true; // Chỉ tìm những tài khoản đã bị khóa (xóa mềm)
    } else if (status === 'ACTIVE') {
      filter.isDeleted = { $ne: true }; // Chỉ tìm những tài khoản chưa bị khóa
    }

    if (search) {
      filter.$or = [
        { fullName: new RegExp(search, 'i') },
        { email: new RegExp(search, 'i') },
        { phone: new RegExp(search, 'i') },
        { memberCode: new RegExp(search, 'i') },
      ];
    }

    if (tier && tier !== 'all') {
      filter.tier = tier;
    }

    const [data, totalItems] = await Promise.all([
      this.userRepository.findCustomersWithPagination(
        filter,
        skip,
        Number(limit),
      ),
      this.userRepository.countCustomers(filter),
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

  async create(createUserDto: any) {
    // 1. Kiểm tra trùng Email
    const emailExists = await this.userRepository.findByEmail(
      createUserDto.email,
    );
    if (emailExists) {
      throw new ConflictException('Email đã tồn tại trong hệ thống!');
    }

    // 2. Kiểm tra trùng Số điện thoại
    const phoneExists =
      await this.userRepository.findByEmailOrPhoneWithPassword(
        createUserDto.phone,
      );
    if (phoneExists) {
      throw new ConflictException('Số điện thoại đã tồn tại trong hệ thống!');
    }

    // 3. Hash mật khẩu (Vẫn giữ lại bcrypt cho hàm này)
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      saltOrRounds,
    );

    // 4. Tạo Object mới và lưu
    const newUser = {
      ...createUserDto,
      password: hashedPassword,
      isDeleted: false, // Đảm bảo đồng nhất dữ liệu
    };

    return await this.userRepository.create(newUser);
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id: string) {
    // Thay vì dùng findById (bị chặn bởi điều kiện isDeleted: false), 
    // ta dùng findByIdWithDeleted để Admin xem được cả người đã bị khóa.
    const user = await this.userRepository.findByIdWithDeleted(id);
    
    if (!user) {
      throw new NotFoundException('Không tìm thấy người dùng');
    }
    
    return user;
  }

  async update(id: string, updateData: any) {
    const updatedUser = await this.userRepository.update(id, updateData);
    if (!updatedUser)
      throw new NotFoundException('Không tìm thấy tài khoản để cập nhật!');
    return updatedUser;
  }

  async remove(id: string) {
    // Xóa mềm hay xóa cứng tùy thuộc vào hàm delete trong repository
    const deleted = await this.userRepository.delete(id);
    if (!deleted)
      throw new NotFoundException('Không tìm thấy tài khoản để xóa!');
    return { message: 'Đã xóa tài khoản thành công!' };
  }

  async getStaffList(query: any) {
    // Truyền thẳng cục query gốc (chứa keyword, status, role...) từ Controller xuống cho Repository xử lý
    const staffs = await this.userRepository.findStaffList(query);

    return {
      success: true,
      data: staffs,
      total: staffs.length, // Đếm số lượng để FE hiển thị nếu cần
    };
  }

  async toggleLock(id: string) {
    // 1. Dùng hàm mới để TÌM ĐƯỢC cả những người đã khóa
    const user = await this.userRepository.findByIdWithDeleted(id);
    
    if (!user) throw new NotFoundException('Không tìm thấy người dùng');

    // 2. Dùng hàm mới để CẬP NHẬT ĐƯỢC trạng thái
    return await this.userRepository.updateWithDeleted(id, { isDeleted: !user.isDeleted });
  }
}