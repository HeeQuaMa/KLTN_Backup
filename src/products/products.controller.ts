import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';

@ApiTags('Products') // Gom nhóm lại cho đẹp
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Lấy danh sách sản phẩm' })
  findAll(@Query() query: any) {
    return this.productsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Xem chi tiết 1 sản phẩm' })
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm sản phẩm mới vào kho' })
  create(@Body() productData: CreateProductDto) {
    return this.productsService.create(productData);
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Cập nhật số lượng tồn kho (Nhập/Xuất)' })
  updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto, // Huy dán chữ UpdateStockDto vào đây nè
  ) {
    return this.productsService.updateStock(id, updateStockDto.quantityChange);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi kho' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
