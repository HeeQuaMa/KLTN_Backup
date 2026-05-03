import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto, RegisterDto } from './dto/auth-credentials.dto';
import { AuthGuard } from './guards/auth.guard';

@ApiTags('Quản lý User & Auth')
@Controller()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ============================================
  // NHÓM API AUTHENTICATION (Nhánh feature/BN-BE)
  // ============================================

  @Post('auth/register')
  @ApiOperation({ summary: 'Đăng ký tài khoản mới' })
  async register(@Body() userData: RegisterDto) {
    return await this.usersService.register(userData);
  }

  @Post('auth/login')
  @ApiOperation({ summary: 'Đăng nhập hệ thống' })
  async login(@Body() loginData: LoginDto) {
    return await this.usersService.login(loginData);
  }

  @UseGuards(AuthGuard)
  @Get('auth/profile') // Đã sửa lại path để ăn khớp với nhánh /auth
  @ApiOperation({ summary: 'Lấy thông tin cá nhân (Cần Token)' })
  getProfile(@Request() req) {
    return {
      message: 'Lấy thông tin thành công',
      user: req.user,
    };
  }

  // ============================================
  // NHÓM API QUẢN LÝ USERS (Nhánh connect-db)
  // ============================================

  @Post('users')
  @ApiOperation({ summary: 'Thêm User mới vào hệ thống' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('users')
  @ApiOperation({ summary: 'Lấy danh sách tất cả User' })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('users/customers/stats')
  @ApiOperation({ summary: 'Lấy thống kê thẻ Khách hàng' })
  getCustomerStats() {
    return this.usersService.getCustomerStats();
  }

  @Get('users/customers/list')
  @ApiOperation({ summary: 'Lấy danh sách Khách hàng (có phân trang & lọc)' })
  getCustomers(@Query() query: any) {
    return this.usersService.getCustomerList(query);
  }

  @Get('users/staff/list')
  @ApiOperation({
    summary: 'Lấy danh sách Nhân viên (có lọc theo vai trò, chi nhánh)',
  })
  getStaffList(@Query() query: any) {
    return this.usersService.getStaffList(query);
  }

  @Get('users/:id')
  @ApiOperation({ summary: 'Xem chi tiết 1 User' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch('users/:id')
  @ApiOperation({ summary: 'Cập nhật thông tin User' })
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete('users/:id')
  @ApiOperation({ summary: 'Xóa User (Xóa mềm)' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Patch('users/:id/toggle-lock')
  @ApiOperation({ summary: 'Khóa hoặc mở khóa tài khoản' })
  toggleLock(@Param('id') id: string) {
    return this.usersService.toggleLock(id);
  }
}
