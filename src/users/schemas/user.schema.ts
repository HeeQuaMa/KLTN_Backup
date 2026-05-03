import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

// Thêm Enum cho Hạng thẻ
export enum CustomerTier {
  MEMBER = 'Member',
  SILVER = 'Silver',
  GOLD = 'Gold',
  PLATINUM = 'Platinum',
}

export enum SystemRole {
  SUPER_ADMIN = 'Super Admin',
  STORE_MANAGER = 'Store Manager',
  SALES_STAFF = 'Sales Staff',
  WAREHOUSE_STAFF = 'Warehouse Staff',
  CUSTOMER = 'Customer', 
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  /** Đăng nhập admin / legacy (vd. admin_nettech) */
  @Prop({ unique: true, sparse: true })
  username?: string;

  @Prop({ required: true, select: false })
  password: string;

  @Prop({ required: true })
  fullName: string;

  @Prop({ default: 'CUSTOMER' })
  role: string;
  // ==========================================
  // @Prop({ type: String, enum: SystemRole, default: SystemRole.CUSTOMER })
  // role: string;
  // ==========================================

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Branch', sparse: true })
  branchId: string;

  // ==========================================
  // THÊM CÁC TRƯỜNG MỚI CHO TÍNH NĂNG KHÁCH HÀNG
  // ==========================================
  
  @Prop({ unique: true, sparse: true }) // sparse: true để cho phép null nếu tạo user admin không có phone
  phone: string;

  @Prop({ unique: true, sparse: true })
  memberCode: string; // Vd: #MEM-001

  @Prop({ type: String, enum: CustomerTier, default: CustomerTier.MEMBER })
  tier: string;

  @Prop({ default: 0 })
  totalSpent: number;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);