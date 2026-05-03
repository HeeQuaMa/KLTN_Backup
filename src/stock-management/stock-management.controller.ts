import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { StockManagementService } from './stock-management.service';
import { StockRequestStatus } from './schemas/stock-request.schema';
import { StockTransferStatus } from './schemas/stock-transfer.schema';

// ─── Phiếu yêu cầu hàng: /stock-requests ────────────────────────────────────
@Controller('stock-requests')
export class StockRequestsController {
  constructor(private readonly service: StockManagementService) {}

  // POST /stock-requests — Tạo phiếu yêu cầu hàng mới
  @Post()
  async create(@Body() body: any) {
    return await this.service.createRequest(body);
  }

  // GET /stock-requests?status=PENDING&branchId=xxx — Danh sách (lọc tuỳ chọn)
  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('branchId') branchId?: string,
  ) {
    return await this.service.getAllRequests(status, branchId);
  }

  // GET /stock-requests/:id — Chi tiết một phiếu yêu cầu
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.getRequestById(id);
  }

  /**
   * PATCH /stock-requests/:id/status — Duyệt / Từ chối / Hoàn thành phiếu
   * Body: {
   *   "status": "APPROVED" | "REJECTED" | "COMPLETED",
   *   "sourceBranchId": "<branchId>",   ← BẮT BUỘC khi APPROVED (kho xuất hàng)
   *   "note": "..."                      ← tuỳ chọn
   * }
   * Khi APPROVED → tự động tạo StockTransfer mới trong collection stocktransfers
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body()
    body: {
      status: StockRequestStatus;
      sourceBranchId?: string;
      note?: string;
    },
  ) {
    return await this.service.updateRequestStatus(
      id,
      body.status,
      body.note,
      body.sourceBranchId,
    );
  }
}

// ─── Lệnh điều chuyển hàng: /stock-transfers ─────────────────────────────────
@Controller('stock-transfers')
export class StockTransfersController {
  constructor(private readonly service: StockManagementService) {}

  // POST /stock-transfers — Tạo lệnh điều chuyển hàng mới
  @Post()
  async create(@Body() body: any) {
    return await this.service.createTransfer(body);
  }

  // GET /stock-transfers?status=SHIPPING — Danh sách (lọc tuỳ chọn)
  @Get()
  async findAll(@Query('status') status?: string) {
    return await this.service.getAllTransfers(status);
  }

  // GET /stock-transfers/:id — Chi tiết một lệnh điều chuyển
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.service.getTransferById(id);
  }

  /**
   * PATCH /stock-transfers/:id/status — Cập nhật trạng thái vận chuyển
   * Body: { "status": "DELIVERED" | "CANCELLED" }
   *
   *  Khi status = "DELIVERED":
   *   → Tự động trừ kho xuất (fromBranch) và cộng kho nhập (toBranch)
   *      cho từng sản phẩm trong danh sách items
   */
  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: StockTransferStatus },
  ) {
    return await this.service.updateTransferStatus(id, body.status);
  }
}

// ─── Tồn kho theo chi nhánh: /branch-inventory ───────────────────────────────
@Controller('branch-inventory')
export class BranchInventoryController {
  constructor(private readonly service: StockManagementService) {}

  // GET /branch-inventory/:branchId — Xem toàn bộ tồn kho tại một chi nhánh
  @Get(':branchId')
  async getByBranch(@Param('branchId') branchId: string) {
    return await this.service.getInventoryByBranch(branchId);
  }
}
