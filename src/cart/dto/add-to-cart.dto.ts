import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  Min,
  IsNotEmpty,
} from 'class-validator';

// DTO cho POST /cart/add
// Các trường khớp với CartItem trong useCartStore.ts của Phát
export class AddToCartDto {
  @ApiProperty({
    example: 'user_abc123',
    description: 'ID của người dùng (lấy từ session hoặc JWT sau này)',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: '65af3000f123456789abcdef',
    description: 'MongoDB _id của sản phẩm (= id trong CartItem FE)',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    example: 'abc123-Core i7 - 16GB',
    description:
      'ID phân biệt dòng trong giỏ (productId + configName). ' +
      'Nếu cartItemId đã tồn tại trong giỏ thì tăng số lượng thay vì thêm mới',
  })
  @IsString()
  @IsNotEmpty()
  cartItemId: string;

  @ApiProperty({ example: 'Laptop Asus ROG Strix G16' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 32990000, minimum: 0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    example: 'https://cdn.example.com/img/rog.jpg',
    required: false,
    default: '',
  })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ example: 1, minimum: 1, default: 1 })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({
    example: 'Core i7 - 16GB - 512GB',
    required: false,
    description: 'Cấu hình được chọn (configName trong FE)',
  })
  @IsString()
  @IsOptional()
  configName?: string;

  @ApiProperty({
    example: 'G614JV-N3014W',
    required: false,
  })
  @IsString()
  @IsOptional()
  sku?: string;
}
