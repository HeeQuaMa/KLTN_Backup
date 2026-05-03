import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

// ── Sub-schema: một mặt hàng trong giỏ ──────────────────────────────────────
// Đặt tên trường khớp với interface CartItem bên FE (useCartStore.ts)
@Schema({ _id: false }) // Không cần _id riêng cho sub-document
export class CartItem {
  @ApiProperty({
    example: 'abc123-Core i7 - 16GB',
    description:
      'ID phân biệt mỗi dòng trong giỏ hàng (= productId + configName). ' +
      'Khớp với cartItemId trong useCartStore.ts của FE',
  })
  @Prop({ required: true })
  cartItemId: string;

  @ApiProperty({
    example: '65af3000f123456789abcdef',
    description: 'MongoDB _id của sản phẩm (tương ứng với id trong CartItem FE)',
  })
  @Prop({ required: true })
  productId: string;

  @ApiProperty({ example: 'Laptop Asus ROG Strix G16', description: 'Tên sản phẩm' })
  @Prop({ required: true })
  name: string;

  @ApiProperty({ example: 32990000, description: 'Đơn giá tại thời điểm thêm vào giỏ' })
  @Prop({ required: true, min: 0 })
  price: number;

  @ApiProperty({
    example: 'https://cdn.example.com/img/rog.jpg',
    description: 'URL ảnh đại diện sản phẩm (tương ứng với image trong CartItem FE)',
  })
  @Prop({ default: '' })
  image: string;

  @ApiProperty({ example: 2, description: 'Số lượng, tối thiểu là 1', minimum: 1 })
  @Prop({ required: true, min: 1 })
  quantity: number;

  @ApiProperty({
    example: 'Core i7 - 16GB - 512GB',
    description: 'Tên cấu hình được chọn (không bắt buộc)',
    required: false,
  })
  @Prop()
  configName?: string;

  @ApiProperty({
    example: 'G614JV-N3014W',
    description: 'Mã SKU của sản phẩm (không bắt buộc)',
    required: false,
  })
  @Prop()
  sku?: string;
}

export const CartItemSchema = SchemaFactory.createForClass(CartItem);

// ── Schema chính: giỏ hàng của một user ────────────────────────────────────
@Schema({ timestamps: true }) // Tự động lưu createdAt và updatedAt
export class Cart extends Document {
  @ApiProperty({
    example: 'user_abc123',
    description: 'ID của người dùng sở hữu giỏ hàng (mỗi user có đúng 1 giỏ)',
  })
  @Prop({ required: true, unique: true, index: true }) // unique để mỗi user chỉ có 1 giỏ
  userId: string;

  @ApiProperty({
    type: [CartItem],
    description: 'Danh sách sản phẩm trong giỏ hàng',
  })
  @Prop({ type: [CartItemSchema], default: [] })
  items: CartItem[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
