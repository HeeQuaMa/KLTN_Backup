import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { CartRepository } from './cart.repository';
import { CartSchema } from './schemas/cart.schema';

@Module({
  imports: [
    // Khai báo Model Cart vào Module cho Mongoose xài
    MongooseModule.forFeature([{ name: 'Cart', schema: CartSchema }]),
  ],
  controllers: [CartController],
  providers: [
    CartService,
    CartRepository, // Nhớ thêm Repository vào providers để Service dùng được
  ],
  exports: [CartService], // Export để SalesModule hoặc OrderModule có thể clearCart sau khi đặt hàng
})
export class CartModule {}
