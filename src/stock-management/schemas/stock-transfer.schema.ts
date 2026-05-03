import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

// Trạng thái phiếu chuyển hàng
export enum StockTransferStatus {
  SHIPPING = 'SHIPPING',     // Đang vận chuyển
  DELIVERED = 'DELIVERED',   // Đã giao đến kho nhập
  CANCELLED = 'CANCELLED',   // Đã huỷ
}

// Sub-schema cho từng dòng sản phẩm trong phiếu chuyển
@Schema({ _id: false })
export class StockTransferItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  productId: Types.ObjectId;

  @Prop({ required: true, min: 1 })
  quantity: number;
}
export const StockTransferItemSchema =
  SchemaFactory.createForClass(StockTransferItem);

// Schema chính: Phiếu chuyển hàng giữa hai kho / chi nhánh
@Schema({ timestamps: true })
export class StockTransfer extends Document {
  // Kho / chi nhánh xuất hàng (null khi chưa xác định nguồn)
  @Prop({ type: Types.ObjectId, ref: 'Branch', default: null })
  fromBranch: Types.ObjectId | null;

  // Phiếu yêu cầu đã sinh ra Transfer này (để truy vết)
  @Prop({ type: Types.ObjectId, ref: 'StockRequest', default: null })
  sourceRequestId: Types.ObjectId | null;

  // Kho / chi nhánh nhập hàng
  @Prop({ type: Types.ObjectId, ref: 'Branch', required: true })
  toBranch: Types.ObjectId;

  // Danh sách sản phẩm và số lượng chuyển
  @Prop({ type: [StockTransferItemSchema], default: [] })
  items: StockTransferItem[];

  // Trạng thái vận chuyển
  @Prop({
    type: String,
    enum: StockTransferStatus,
    default: StockTransferStatus.SHIPPING,
  })
  status: StockTransferStatus;

  // Ngày thực hiện chuyển hàng
  @Prop({ type: Date, default: Date.now })
  transferDate: Date;
}

export const StockTransferSchema = SchemaFactory.createForClass(StockTransfer);
