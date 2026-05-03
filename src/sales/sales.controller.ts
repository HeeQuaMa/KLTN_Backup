import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { SalesService } from './sales.service';
import { OptionalJwtAuthGuard } from '../users/guards/auth.guard';

@ApiTags('Sales')
@Controller('sales')
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  /**
   * Gắn user từ JWT nếu có Bearer token; không có token thì dùng `userId` trong body (API cũ).
   */
  @UseGuards(OptionalJwtAuthGuard)
  @Post('checkout')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Đặt hàng',
    description:
      'Có Bearer token: user lấy từ JWT. Không có token: gửi userId trong body như phiên bản trước.',
  })
  async checkout(
    @Req() req: Request & { user?: { id?: string; sub?: string } },
    @Body() checkoutData: Record<string, unknown>,
  ) {
    const jwtId = req.user?.id ?? req.user?.sub;
    const bodyId = (checkoutData as { userId?: string }).userId;
    const userId =
      jwtId !== undefined && String(jwtId).trim() !== ''
        ? String(jwtId)
        : bodyId !== undefined && String(bodyId).trim() !== ''
          ? String(bodyId)
          : '';
    return await this.salesService.checkout(userId, checkoutData);
  }
}
