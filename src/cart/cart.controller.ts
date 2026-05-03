import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';

@ApiTags('Cart') // Nhóm toàn bộ API giỏ hàng lại trong Swagger UI
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  // POST /cart/add — Thêm sản phẩm vào giỏ
  // Nếu cartItemId đã tồn tại → tăng số lượng (giống addItem trong useCartStore.ts FE)
  @Post('add')
  @ApiOperation({
    summary: 'Thêm sản phẩm vào giỏ hàng (hoặc tăng số lượng nếu đã có)',
  })
  addItem(@Body() dto: AddToCartDto) {
    return this.cartService.addItem(dto);
  }

  // GET /cart/:userId — Lấy toàn bộ giỏ hàng của một user
  @Get(':userId')
  @ApiOperation({ summary: 'Lấy giỏ hàng của một user theo userId' })
  @ApiParam({
    name: 'userId',
    example: 'user_abc123',
    description: 'ID của người dùng',
  })
  getCart(@Param('userId') userId: string) {
    return this.cartService.getCart(userId);
  }

  // PATCH /cart/update-quantity — Cập nhật số lượng sản phẩm trong giỏ
  // Dùng cartItemId (khớp với updateQuantity(cartItemId, quantity) trong useCartStore.ts FE)
  @Patch('update-quantity')
  @ApiOperation({
    summary: 'Cập nhật số lượng của một sản phẩm trong giỏ hàng',
  })
  updateQuantity(@Body() dto: UpdateQuantityDto) {
    return this.cartService.updateQuantity(dto);
  }

  // DELETE /cart/remove/:userId/:cartItemId — Xóa 1 sản phẩm khỏi giỏ
  // Dùng cartItemId thay vì productId để khớp với removeItem(cartItemId) trong FE
  @Delete('remove/:userId/:cartItemId')
  @ApiOperation({ summary: 'Xóa một sản phẩm khỏi giỏ hàng theo cartItemId' })
  @ApiParam({ name: 'userId', example: 'user_abc123' })
  @ApiParam({
    name: 'cartItemId',
    example: 'abc123-Core i7 - 16GB',
    description:
      'cartItemId phân biệt dòng trong giỏ (= productId + configName)',
  })
  removeItem(
    @Param('userId') userId: string,
    @Param('cartItemId') cartItemId: string,
  ) {
    return this.cartService.removeItem(userId, cartItemId);
  }

  // DELETE /cart/clear/:userId — Xóa toàn bộ giỏ hàng của user
  // Dùng sau khi đặt hàng thành công (tương ứng clearCart() trong FE)
  @Delete('clear/:userId')
  @ApiOperation({ summary: 'Xóa toàn bộ giỏ hàng sau khi đặt hàng thành công' })
  @ApiParam({ name: 'userId', example: 'user_abc123' })
  clearCart(@Param('userId') userId: string) {
    return this.cartService.clearCart(userId);
  }
}
