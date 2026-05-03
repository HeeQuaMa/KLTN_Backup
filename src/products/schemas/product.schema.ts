import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, index: true }) // Thêm index để tìm kiếm tên nhanh hơn
  name: string;

  @Prop({ required: true }) // Nên để required để biết hãng nào mà lọc
  brand: string;

  @Prop({ required: true, type: Number, min: 0 }) // min: 0 để giá không bị âm
  price: number;

  @Prop({ type: Object })
  specifications: any;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category: Types.ObjectId;

  @Prop({ default: 0, min: 0 }) // min: 0 để kho không bị âm
  totalStock: number;

  // --- CÁC TRƯỜNG BỔ SUNG ---

  @Prop({ default: true }) // Để có thể ẩn/hiện sản phẩm mà không cần xóa
  isActive: boolean;

  @Prop() // Mô tả ngắn gọn về sản phẩm
  description: string;

  @Prop({ type: [String] }) // Mảng các đường dẫn ảnh sản phẩm
  images: string[];

  @Prop({ unique: true, sparse: true }) // Mã định danh sản phẩm (Ví dụ: CPU-INTEL-14900K)
  sku: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
