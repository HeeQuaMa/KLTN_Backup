import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class ProductItem extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true, unique: true })
  serialNumber: string;

  @Prop({ default: 'AVAILABLE', enum: ['AVAILABLE', 'SOLD', 'MAINTENANCE'] })
  status: string;
}

export const ProductItemSchema = SchemaFactory.createForClass(ProductItem);
