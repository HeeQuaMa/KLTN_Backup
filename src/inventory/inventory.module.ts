import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from '../products/schemas/product.schema';
import { UsersModule } from '../users/users.module';
import { AdminDashboardGuard } from '../dashboard/guards/admin-dashboard.guard';
import { InventoryController } from './inventory.controller';
import { InventoryService } from './inventory.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    UsersModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService, AdminDashboardGuard],
})
export class InventoryModule {}
