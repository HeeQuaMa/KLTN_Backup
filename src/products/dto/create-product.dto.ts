import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, IsObject, Min } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ example: 'CPU Intel Core i9-14900K' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Intel', required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ example: 15500000 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ example: '65af3000f123456789abcdef', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ example: { socket: 'LGA1700', cores: 24 }, required: false })
  @IsObject()
  @IsOptional()
  specifications?: any;

  @ApiProperty({ example: 20, default: 0 })
  @IsNumber()
  @IsOptional()
  @Min(0)
  totalStock?: number;

  @ApiProperty({ example: 'SKU-INTEL-001', required: false })
  @IsString()
  @IsOptional()
  sku?: string;
}
