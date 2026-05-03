import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class InventoryAdminQueryDto {
  @ApiPropertyOptional({ enum: ['all', 'q5', 'q1', 'q10'] })
  @IsOptional()
  @IsString()
  @IsIn(['all', 'q5', 'q1', 'q10'])
  branch?: string;

  @ApiPropertyOptional({ description: 'Tìm SKU hoặc tên sản phẩm' })
  @IsOptional()
  @IsString()
  q?: string;
}
