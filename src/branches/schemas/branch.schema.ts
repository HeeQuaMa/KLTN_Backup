import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

// Enum trạng thái chi nhánh
export enum BranchStatus {
  ACTIVE = 'active', // Đang hoạt động bình thường
  MAINTENANCE = 'maintenance', // Đang bảo trì, tạm ngừng
}

@Schema({ timestamps: true }) // Tự động thêm createdAt và updatedAt
export class Branch extends Document {
  @ApiProperty({
    example: 'NetTech Quận 1',
    description: 'Tên của chi nhánh',
  })
  @Prop({ required: true }) // Tên chi nhánh, bắt buộc phải có
  name: string;

  @ApiProperty({
    example: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM',
    description: 'Địa chỉ đầy đủ của chi nhánh',
  })
  @Prop({ required: true }) // Địa chỉ cụ thể của chi nhánh
  address: string;

  @ApiProperty({
    example: '028.1234.5678',
    description: 'Số điện thoại liên hệ của chi nhánh',
  })
  @Prop({ required: true }) // Số điện thoại liên hệ của chi nhánh
  phone: string;

  @ApiProperty({
    example: 'https://maps.google.com/?q=NetTech+Quan1',
    description: 'Link nhúng Google Maps để hiển thị bản đồ',
    required: false,
  })
  @Prop() // Link nhúng Google Maps (thêm sau cũng được)
  mapUrl: string;

  @ApiProperty({
    example: BranchStatus.ACTIVE,
    enum: BranchStatus,
    description: `Trạng thái chi nhánh: "${BranchStatus.ACTIVE}" = đang hoạt động, "${BranchStatus.MAINTENANCE}" = đang bảo trì`,
    default: BranchStatus.ACTIVE,
  })
  @Prop({
    type: String,
    enum: BranchStatus,
    default: BranchStatus.ACTIVE, // Mặc định khi tạo mới là đang hoạt động
  })
  status: BranchStatus;
}

export const BranchSchema = SchemaFactory.createForClass(Branch);
