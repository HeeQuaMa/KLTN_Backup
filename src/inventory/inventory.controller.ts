import { Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { InventoryAdminQueryDto } from './dto/inventory-admin.dto';
import { AuthGuard } from '../users/guards/auth.guard';
import { AdminDashboardGuard } from '../dashboard/guards/admin-dashboard.guard';

@ApiTags('Inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @UseGuards(AuthGuard, AdminDashboardGuard)
  @Get('admin')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Quản trị kho: KPI + bảng tồn',
    description:
      'Query: branch=all|q5|q1|q10, q= SKU hoặc tên. KPI và cột tồn theo chi nhánh khi branch khác all.',
  })
  async admin(@Query() query: InventoryAdminQueryDto) {
    return this.inventoryService.getAdminInventory(query);
  }

  @UseGuards(AuthGuard, AdminDashboardGuard)
  @Post('import')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Nhập kho (placeholder)' })
  importPlaceholder() {
    return {
      ok: true,
      message: 'Nhập kho — API đang được triển khai.',
    };
  }

  @UseGuards(AuthGuard, AdminDashboardGuard)
  @Post('audit')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Kiểm kê (placeholder)' })
  auditPlaceholder() {
    return {
      ok: true,
      message: 'Kiểm kê — API đang được triển khai.',
    };
  }
}
