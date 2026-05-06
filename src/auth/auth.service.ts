import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from '../users/users.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(userData: any) {
    // Kiểm tra Email trước (như cũ)
    const exists = await this.userRepository.findByEmail(userData.email);
    if (exists) throw new ConflictException('Email đã tồn tại!');

    // Mã hóa mật khẩu trước khi lưu
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);

    // Ghi đè password gốc bằng password đã hash
    const newUserInfo = { ...userData, password: hashedPassword };

    // BẪY LỖI: Dùng try...catch để tóm gọn lỗi trùng Số điện thoại từ Database ném ra
    try {
      return await this.userRepository.create(newUserInfo);
    } catch (error: any) {
      // 11000 là mã lỗi kinh điển của MongoDB khi trùng một trường unique (như phone)
      if (error.code === 11000) {
        const duplicateField = Object.keys(error.keyValue || {})[0];
        if (duplicateField === 'phone') {
          throw new ConflictException('Số điện thoại này đã được đăng ký!');
        }
        // Fallback đề phòng trùng trường khác
        throw new ConflictException(
          `Dữ liệu ${duplicateField} đã tồn tại trong hệ thống!`,
        );
      }
      // Lỗi sập server khác thì ném ra ngoài bình thường
      throw error;
    }
  }

  async login(loginData: any) {
    // Lấy email nếu có, không thì lấy emailOrPhone. Có cái nào dùng cái đó!
    const identifier = loginData.email || loginData.emailOrPhone;
    const password = loginData.password;

    // Sau đó dùng identifier để tìm user
    const user =
      await this.userRepository.findByEmailOrPhoneWithPassword(identifier);

    // THÊM 2 DÒNG NÀY:
    console.log('🔍 USER DATA:', user);
    console.log('🔑 PASSWORD TRONG DB:', user?.password);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
    }

    const isPasswordMatching = await bcrypt.compare(
      password,
      (user as any).password,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
    }

    // ==========================================
    // BƯỚC QUAN TRỌNG: TỰ ĐỘNG CHUẨN HÓA ROLE
    // Biến "Super Admin" thành "SUPER_ADMIN"
    // ==========================================
    const normalizedRole = user.role
      ? user.role.toUpperCase().replace(/\s+/g, '_')
      : 'USER'; // Fallback an toàn nếu lỡ user ko có role

    const payload = {
      id: user._id,
      email: user.email,
      role: normalizedRole, // Dùng role đã chuẩn hóa nhét vào Token
      fullName: (user as any).fullName,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      // Trả về luôn role chuẩn cho cái `admin_info` bên Frontend lưu
      user: {
        fullName: (user as any).fullName,
        email: user.email,
        role: normalizedRole,
      },
    };
  }
}
