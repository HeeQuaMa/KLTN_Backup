import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import type { Express, Request } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import {
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { productImagesMulterOptions } from './multer-product-upload';

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

  @Post('multipart')
  @ApiConsumes('multipart/form-data')
  @ApiOperation({
    summary: 'Thêm sản phẩm (FormData)',
    description:
      'multipart/form-data: fields text + file field `images` (tối đa 15). Url ảnh → Product.images[].',
  })
  @UseInterceptors(
    FilesInterceptor('images', 15, productImagesMulterOptions()),
  )
  createMultipart(
    @UploadedFiles()
    files: Express.Multer.File[] | undefined,
    @Body() body: Record<string, string>,
    @Req() req: Request,
  ): Promise<unknown> {
    const publicBase = (
      process.env.PUBLIC_API_URL ??
      `${req.protocol}://${req.get('host') ?? ''}`
    ).replace(/\/$/, '');
    const uploaded = Array.isArray(files) ? files : [];
    const imageUrls = uploaded.map(
      (f) => `${publicBase}/uploads/products/${f.filename}`,
    );

    return this.productsService.createFromMultipart({
      name: body.name?.trim(),
      sku: body.sku,
      brand: body.brand,
      price: body.price,
      importPrice: body.importPrice,
      categorySlug: body.categorySlug ?? body.category,
      description: body.description,
      totalStock: body.totalStock,
      specifications:
        typeof body.specifications === 'string'
          ? body.specifications
          : undefined,
      images: imageUrls,
    });
  }

  @Patch(':id/stock')
  @ApiOperation({ summary: 'Cập nhật số lượng tồn kho (Nhập/Xuất)' })
  updateStock(
    @Param('id') id: string,
    @Body() updateStockDto: UpdateStockDto, // Huy dán chữ UpdateStockDto vào đây nè
  ) {
    return this.productsService.updateStock(id, updateStockDto.quantityChange);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Cập nhật thông tin sản phẩm' })
  update(@Param('id') id: string, @Body() updateData: any) {
    return this.productsService.update(id, updateData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Xóa sản phẩm khỏi kho' })
  remove(@Param('id') id: string) {
    return this.productsService.remove(id);
  }
}
