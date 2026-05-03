import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Trạng thái phiếu yêu cầu hàng
export enum StockRequestStatus {
  PENDING = 'PENDING',     // Chờ duyệt
  APPROVED = 'APPROVED',   // Đã duyệt
  REJECTED = 'REJECTED',   // Bị từ chối
  COMPLETED = 'COMPLETED', // Đã hoàn thành (hàng đã chuyển đến)
}

// Sub-schema cho từng dòng sản phẩm trong yêu cầu
@Schema({ _id: false })
export class StockRequestItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;
}
export const StockRequestItemSchema =
  SchemaFactory.createForClass(StockRequestItem);

// Schema chính: Phiếu yêu cầu hàng từ chi nhánh
@Schema({ timestamps: true })
export class StockRequest extends Document {
  // Người tạo yêu cầu (nhân viên / quản lý chi nhánh)
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  requester: Types.ObjectId;

  // Chi nhánh cần hàng (sẽ là toBranch khi tạo Transfer)
  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  branchId: Types.ObjectId;

  // Kho xuất hàng (sẽ là fromBranch khi tạo Transfer) — điền lúc duyệt
  @Prop({ type: Types.ObjectId, ref: 'Branch', default: null })
  sourceBranchId: Types.ObjectId | null;

  // Danh sách sản phẩm và số lượng cần
  @Prop({ type: [StockRequestItemSchema], default: [] })
  items: StockRequestItem[];

  // Trạng thái phiếu
  @Prop({
    type: String,
    enum: StockRequestStatus,
    default: StockRequestStatus.PENDING,
  })
  status: StockRequestStatus;

  // Ghi chú thêm (lý do yêu cầu, ưu tiên, ...)
  @Prop({ type: String, default: '' })
  note: string;
}

export const StockRequestSchema = SchemaFactory.createForClass(StockRequest);
