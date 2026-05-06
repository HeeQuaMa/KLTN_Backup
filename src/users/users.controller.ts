import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateUserDto } from './dto/create-user.dto';

@ApiTags('Quản lý User')
@Controller() // Bạn có thể cân nhắc đổi thành @Controller('users') sau này để code chuẩn RESTful hơn
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ============================================
  // NHÓM API QUẢN LÝ USERS (Nhánh connect-db)
  // Đã chuyển phần Auth sang auth.controller.ts
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