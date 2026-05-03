import { Controller, Post, Body } from '@nestjs/common';
import { SalesService } from './sales.service';

@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post('checkout')
  async checkout(@Body() checkoutData: any) {
    return await this.salesService.checkout(checkoutData);
  }
}
