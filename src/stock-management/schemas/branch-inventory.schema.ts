import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Lưu số lượng tồn kho của từng sản phẩm tại từng chi nhánh.
// Mỗi cặp (branchId + productId) là duy nhất — dùng upsert để tránh trùng.
@Schema({ timestamps: true })
export class BranchInventory extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  // Số lượng hiện có tại chi nhánh này (không được âm)
  @Prop({ type: Number, default: 0, min: 0 })
  quantity: number;
}

export const BranchInventorySchema =
  SchemaFactory.createForClass(BranchInventory);

// Index kép để tìm kiếm nhanh và đảm bảo mỗi cặp chỉ xuất hiện 1 lần
BranchInventorySchema.index({ branchId: 1, productId: 1 }, { unique: true });
