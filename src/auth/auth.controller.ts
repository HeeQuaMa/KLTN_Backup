import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { AuthGuard } from '../users/guards/auth.guard'; // Đường dẫn trỏ về AuthGuard cũ của bạn

@ApiTags('Authentication')
@Controller('auth') // Đã bao gồm chữ /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  async register(@Body() userData: any) {
    return await this.authService.register(userData);
  }

  @Post('login')
  @ApiOperation({ summary: 'Đăng nhập hệ thống' })
  async login(@Body() loginData: any) {
    return await this.authService.login(loginData);
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @ApiOperation({ summary: 'Lấy thông tin cá nhân (Cần Token)' })
  getProfile(@Request() req) {
    return {
      message: 'Lấy thông tin thành công',
      user: req.user,
    };
  }
}