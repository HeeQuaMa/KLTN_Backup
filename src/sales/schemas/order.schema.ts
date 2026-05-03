import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

/** Kênh đặt hàng — gắn badge "Mua tại quầy" khi O2O */
export const ORDER_CHANNELS = ['ONLINE', 'O2O'] as const;
export type OrderChannel = (typeof ORDER_CHANNELS)[number];

/**
 * Trạng thái đơn — khớp tab UI: Chờ xác nhận / Đang giao / Hoàn thành / Đã hủy
 * (legacy: PENDING → coi như chờ xác nhận)
 */
export const ORDER_STATUSES = [
  'PENDING_CONFIRMATION',
  'PACKING',
  'SHIPPING',
  'COMPLETED',
  'CANCELLED',
  /** @deprecated dùng dữ liệu cũ */
  'PENDING',
] as const;
export type OrderStatusCode = (typeof ORDER_STATUSES)[number];

@Schema({ timestamps: true })
export class Order extends Document {
  /** Mã hiển thị: #NT-2026-8892 — optional cho đơn cũ trước migration */
  @Prop({ unique: true, sparse: true })
  orderCode?: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;

  @Prop({ type: String, enum: ORDER_CHANNELS, default: 'ONLINE' })
  channel: OrderChannel;

  @Prop({
    type: String,
    enum: ORDER_STATUSES,
    default: 'PENDING_CONFIRMATION',
  })
  status: OrderStatusCode;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        /** Đơn giá tại thời điểm mua */
        price: { type: Number },
        /** Snapshot để lịch sử không phụ thuộc Product hiện tại */
        productName: { type: String },
        variant: { type: String },
        imageUrl: { type: String },
      },
    ],
    default: [],
  })
  items: Array<{
    product?: Types.ObjectId;
    quantity: number;
    price: number;
    productName?: string;
    variant?: string;
    imageUrl?: string;
  }>;

  @Prop({ required: true })
  totalAmount: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
