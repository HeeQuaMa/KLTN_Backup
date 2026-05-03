import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty, Min } from 'class-validator';

// DTO cho PATCH /cart/update-quantity
// Dùng cartItemId (không phải productId) để khớp với logic updateQuantity trong useCartStore.ts
export class UpdateQuantityDto {
  @ApiProperty({
    example: 'user_abc123',
    description: 'ID của người dùng sở hữu giỏ hàng',
  })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({
    example: 'abc123-Core i7 - 16GB',
    description:
      'cartItemId của dòng cần cập nhật (khớp với cartItemId trong useCartStore.ts của FE)',
  })
  @IsString()
  @IsNotEmpty()
  cartItemId: string;

  @ApiProperty({
    example: 3,
    minimum: 1,
    description:
      'Số lượng mới — tối thiểu là 1 (khớp với Math.max(1, quantity) trong FE)',
  })
  @IsNumber()
  @Min(1)
  quantity: number;
}
