import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Khớp FE registerSchema: 8–25 ký tự, có chữ hoa, thường, số; cho phép ký tự đặc biệt (vd. !) */
export class RegisterDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(2)
  fullName: string;

  @IsString()
  @Matches(/^[0-9]{10,15}$/, {
    message: 'Số điện thoại chỉ gồm chữ số, 10–15 ký tự',
  })
  phone: string;

  @IsString()
  @MinLength(8)
  @MaxLength(25)
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, {
    message:
      'Mật khẩu phải có chữ thường, chữ hoa và số (8–25 ký tự)',
  })
  password: string;
}

/**
 * Storefront gửi { emailOrPhone, password }; có thể gửi thêm email / phone / username (legacy).
 */
export class LoginDto {
  /** Storefront FE; có thể dùng `email` thay thế (API cũ). */
  @IsOptional()
  @IsString()
  @MaxLength(256)
  emailOrPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(256)
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(32)
  phone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(128)
  username?: string;

  @IsString()
  @MinLength(6)
  @MaxLength(128)
  password: string;
}
