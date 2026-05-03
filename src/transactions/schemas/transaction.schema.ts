import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TransactionDocument = Transaction & Document;

// Định nghĩa các Enum theo UML
export enum TransactionType {
  Payment = 'Payment',
  Refund = 'Refund',
  Adjustment = 'Adjustment',
}

export enum PaymentMethod {
  COD = 'COD',
  VNPay = 'VNPay',
  Momo = 'Momo',
  CreditCard = 'CreditCard',
}

export enum TransactionStatus {
  Pending = 'Pending',
  Success = 'Success',
  Failed = 'Failed',
  Cancelled = 'Cancelled',
}

@Schema({ timestamps: true })
export class Transaction {
  @Prop({ unique: true, required: true })
  transactionCode: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: true })
  orderId: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Prop({ type: String, enum: TransactionType, required: true })
  type: TransactionType;

  @Prop({ type: String, enum: PaymentMethod, required: true })
  paymentMethod: PaymentMethod;

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({
    type: String,
    enum: TransactionStatus,
    default: TransactionStatus.Pending,
  })
  status: TransactionStatus;

  @Prop({ type: MongooseSchema.Types.Mixed })
  gatewayResponse?: any;

  @Prop()
  providerTransactionId?: string;

  @Prop()
  note?: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
