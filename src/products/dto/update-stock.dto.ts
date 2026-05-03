import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateStockDto {
  @ApiProperty({
    example: -1,
    description: 'Số lượng thay đổi (Số dương là nhập hàng, số âm là bán hàng)',
  })
  @IsNumber()
  quantityChange: number;
}
