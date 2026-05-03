import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { BranchesService } from './branches.service';

@ApiTags('Branches') // Nhóm API này lại trong Swagger UI cho dễ nhìn
@Controller('branches')
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  // GET /branches — Lấy danh sách tất cả chi nhánh
  // Hỗ trợ query ?onlyActive=true để chỉ lấy chi nhánh đang hoạt động
  @Get()
  @ApiOperation({ summary: 'Lấy danh sách tất cả chi nhánh' })
  @ApiQuery({
    name: 'onlyActive',
    required: false,
    type: Boolean,
    description: 'true = chỉ lấy chi nhánh đang hoạt động',
  })
  findAll(@Query('onlyActive') onlyActive?: string) {
    // Chuyển string 'true' từ query param sang boolean
    return this.branchesService.findAll(onlyActive === 'true');
  }

  // GET /branches/:id — Lấy chi tiết một chi nhánh theo ID
  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết một chi nhánh' })
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }
}
