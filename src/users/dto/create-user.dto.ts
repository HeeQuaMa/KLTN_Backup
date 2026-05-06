import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'Họ tên không được để trống' })
  @IsString()
  fullName: string;

  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không đúng định dạng' })
  email: string;

  @IsNotEmpty({ message: 'Số điện thoại không được để trống' })
  @IsString()
  phone: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  status?: string;

  // ✅ ĐÃ THÊM ROLE VÀO ĐÂY ĐỂ NESTJS KHÔNG TỰ ĐỘNG XÓA NỮA
  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  initialTier?: string;
}