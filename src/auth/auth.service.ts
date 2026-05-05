import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
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
    const exists = await this.userRepository.findByEmail(userData.email);
    if (exists) throw new ConflictException('Email đã tồn tại!');

    // Mã hóa mật khẩu trước khi lưu
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(userData.password, saltOrRounds);

    // Ghi đè password gốc bằng password đã hash
    const newUserInfo = { ...userData, password: hashedPassword };

    return await this.userRepository.create(newUserInfo);
  }

  async login(loginData: any) {
    // Lấy email nếu có, không thì lấy emailOrPhone. Có cái nào dùng cái đó!
    const identifier = loginData.email || loginData.emailOrPhone;
    const password = loginData.password;

    // Sau đó dùng identifier để tìm user
    const user = await this.userRepository.findByEmailOrPhoneWithPassword(identifier);

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

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: (user as any).fullName,
    };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { fullName: (user as any).fullName, email: user.email, role: user.role },
    };
  }
}