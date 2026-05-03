import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PromotionsService } from './promotions.service';
// import { AuthGuard } from '../auth/guards/auth.guard'; // Bỏ comment nếu bạn đã có AuthGuard

@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Post()
  // @UseGuards(AuthGuard) // Chỉ Admin mới tạo được mã
  create(@Body() createPromotionDto: any) {
    return this.promotionsService.create(createPromotionDto);
  }

  @Get()
  findAll() {
    return this.promotionsService.findAll();
  }

  @Post('apply') // API Frontend gọi khi User nhập mã ở trang Giỏ Hàng
  applyPromotion(@Body() body: { code: string; orderValue: number }) {
    return this.promotionsService.validatePromotion(body.code, body.orderValue);
  }

  @Patch(':id')
  // @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updatePromotionDto: any) {
    return this.promotionsService.update(id, updatePromotionDto);
  }

  @Delete(':id')
  // @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.promotionsService.disablePromotion(id);
  }
}