import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardMonthQueryDto } from './dto/dashboard-query.dto';
import { AuthGuard } from '../users/guards/auth.guard';
import { AdminDashboardGuard } from './guards/admin-dashboard.guard';

@ApiTags('Dashboard (Super Admin)')
@ApiBearerAuth()
@UseGuards(AuthGuard, AdminDashboardGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @ApiOperation({ summary: 'Thẻ KPI: doanh thu, đơn hàng, KH mới, sắp hết kho + tăng trưởng' })
  @ApiQuery({ name: 'year', required: false, example: 2026 })
  @ApiQuery({ name: 'month', required: false, example: 1 })
  async stats(@Query() query: DashboardMonthQueryDto) {
    return this.dashboardService.getStats(query.year, query.month);
  }

  @Get('revenue-chart')
  @ApiOperation({ summary: 'Doanh thu theo tuần (Online vs O2O) trong tháng chọn' })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'month', required: false })
  async revenueChart(@Query() query: DashboardMonthQueryDto) {
    return this.dashboardService.getRevenueChart(query.year, query.month);
  }

  @Get('top-products')
  @ApiOperation({ summary: 'Top sản phẩm bán chạy (đơn COMPLETED trong tháng)' })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'month', required: false })
  async topProducts(@Query() query: DashboardMonthQueryDto) {
    return this.dashboardService.getTopProducts(query.year, query.month, 3);
  }

  @Get('recent-orders')
  @ApiOperation({ summary: 'Đơn hàng mới nhất trong tháng chọn' })
  @ApiQuery({ name: 'year', required: false })
  @ApiQuery({ name: 'month', required: false })
  async recentOrders(@Query() query: DashboardMonthQueryDto) {
    return this.dashboardService.getRecentOrders(query.year, query.month, 5);
  }
}
