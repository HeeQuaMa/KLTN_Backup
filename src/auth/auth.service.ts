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
    const identifier = [
      loginData.email,
      loginData.emailOrPhone,
      loginData.phone,
      loginData.username,
    ]
      .map((value: any) => String(value ?? '').trim())
      .find((value) => value.length > 0) ?? '';
    const password = loginData.password;

    // Sau đó dùng identifier để tìm user
    const user =
      await this.userRepository.findByEmailOrPhoneWithPassword(identifier);

    if (!user) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
    }

    const storedPassword = String((user as any)?.password ?? '');

    const isPasswordMatching = await bcrypt.compare(
      password,
      storedPassword,
    );

    if (!isPasswordMatching) {
      throw new UnauthorizedException('Email hoặc mật khẩu không đúng!');
    }

    // Giữ nguyên role đúng như dữ liệu trong Atlas (vd: "Super Admin")
    const dbRole = String((user as any).role ?? '');

    const payload = {
      id: user._id,
      email: user.email,
      role: dbRole,
      fullName: (user as any).fullName,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      // Trả về luôn role chuẩn cho cái `admin_info` bên Frontend lưu
      user: {
        fullName: (user as any).fullName,
        email: user.email,
        role: dbRole,
      },
    };
  }
}
