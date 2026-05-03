import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PromotionsService } from './promotions.service';
import { PromotionsController } from './promotions.controller';
import { PromotionsRepository } from './promotions.repository';
import { Promotion, PromotionSchema } from './schemas/promotion.schema';

@Module({
  imports: [
    // Kết nối Schema vào Mongoose
    MongooseModule.forFeature([
      { name: Promotion.name, schema: PromotionSchema },
    ]),
  ],
  controllers: [PromotionsController],
  // Khai báo cả Service và Repository vào mục providers
  providers: [PromotionsService, PromotionsRepository],
  exports: [PromotionsService], // Export ra để mốt module Order gọi hàm validate
})
export class PromotionsModule {}
