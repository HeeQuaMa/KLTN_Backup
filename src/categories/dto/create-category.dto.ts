import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Tên danh mục', example: 'VGA - Card màn hình' })
  name: string;

  @ApiProperty({ description: 'Đường dẫn thân thiện', example: 'vga' })
  slug: string;

  @ApiProperty({
    description: 'Hiển thị trong Build PC',
    example: true,
    required: false,
  })
  pcBuilderVisible?: boolean;

  @ApiProperty({
    description: 'Thuộc tính tương thích',
    type: [Object],
    required: false,
  })
  compatibilityAttributes?: any[];
}
