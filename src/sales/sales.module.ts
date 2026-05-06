import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { OrdersController } from './orders.controller';
import { Order, OrderSchema } from './schemas/order.schema';
import { Product, ProductSchema } from '../products/schemas/product.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { UsersModule } from '../users/users.module';
import { AdminDashboardGuard } from '../dashboard/guards/admin-dashboard.guard';
import { Promotion, PromotionSchema } from '../promotions/schemas/promotion.schema';

/**
 * Không có vòng phụ thuộc với UsersModule (UsersModule không import SalesModule).
 * AuthGuard + JWT_SECRET: ConfigModule global; JwtModule global từ UsersModule.
 */
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: Order.name, schema: OrderSchema },
      { name: Product.name, schema: ProductSchema },
      { name: User.name, schema: UserSchema },
      { name: Promotion.name, schema: PromotionSchema },
    ]),
    UsersModule,
  ],
  controllers: [SalesController, OrdersController],
  providers: [SalesService, AdminDashboardGuard],
  exports: [SalesService],
})
export class SalesModule {}
