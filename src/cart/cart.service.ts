import { Injectable, NotFoundException } from '@nestjs/common';
import { CartRepository } from './cart.repository';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateQuantityDto } from './dto/update-quantity.dto';
import { Cart, CartItem } from './schemas/cart.schema'; // CartItem dùng để tạo newItem object bên dưới

// Service chứa toàn bộ logic nghiệp vụ của giỏ hàng
@Injectable()
export class CartService {
  constructor(private readonly cartRepository: CartRepository) {}

  // ── Lấy giỏ hàng của user ────────────────────────────────────────────────
  async getCart(userId: string): Promise<Cart> {
    // findOrCreate: nếu user chưa có giỏ thì tự tạo giỏ trống
    return await this.cartRepository.findOrCreateByUserId(userId);
  }

  // ── Thêm sản phẩm vào giỏ ────────────────────────────────────────────────
  // Logic giống hệt addItem trong useCartStore.ts của FE:
  //   - Nếu cartItemId đã có → tăng quantity
  //   - Nếu chưa có → thêm mới vào mảng items
  async addItem(dto: AddToCartDto): Promise<Cart> {
    const cart = await this.cartRepository.findOrCreateByUserId(dto.userId);

    // Kiểm tra xem cartItemId này đã tồn tại trong giỏ chưa
    const exists = cart.items.some(
      (item) => item.cartItemId === dto.cartItemId,
    );

    if (exists) {
      // Đã có → tăng thêm số lượng (dùng $inc)
      const updated = await this.cartRepository.incrementQuantity(
        dto.userId,
        dto.cartItemId,
        dto.quantity,
      );
      return updated!;
    }

    // Chưa có → đẩy item mới vào mảng
    const newItem: CartItem = {
      cartItemId: dto.cartItemId,
      productId: dto.productId,
      name: dto.name,
      price: dto.price,
      image: dto.image ?? '',
      quantity: dto.quantity,
      configName: dto.configName,
      sku: dto.sku,
    } as CartItem;

    const updated = await this.cartRepository.pushItem(dto.userId, newItem);
    return updated!;
  }

  // ── Cập nhật số lượng sản phẩm ───────────────────────────────────────────
  // Khớp với updateQuantity(cartItemId, quantity) trong useCartStore.ts
  async updateQuantity(dto: UpdateQuantityDto): Promise<Cart> {
    const cart = await this.cartRepository.findByUserId(dto.userId);
    if (!cart)
      throw new NotFoundException('Không tìm thấy giỏ hàng của user này!');

    const itemExists = cart.items.some(
      (item) => item.cartItemId === dto.cartItemId,
    );
    if (!itemExists)
      throw new NotFoundException(
        `Không tìm thấy sản phẩm với cartItemId "${dto.cartItemId}" trong giỏ!`,
      );

    const updated = await this.cartRepository.setQuantity(
      dto.userId,
      dto.cartItemId,
      dto.quantity,
    );
    return updated!;
  }

  // ── Xóa 1 sản phẩm khỏi giỏ ─────────────────────────────────────────────
  // Dùng cartItemId thay vì productId để khớp với removeItem(cartItemId) trong FE
  async removeItem(userId: string, cartItemId: string): Promise<Cart> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart)
      throw new NotFoundException('Không tìm thấy giỏ hàng của user này!');

    const updated = await this.cartRepository.removeItem(userId, cartItemId);
    return updated!;
  }

  // ── Xóa toàn bộ giỏ hàng ─────────────────────────────────────────────────
  // Dùng sau khi đặt hàng thành công (tương ứng clearCart() trong FE)
  async clearCart(userId: string): Promise<{ message: string }> {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart)
      throw new NotFoundException('Không tìm thấy giỏ hàng của user này!');

    await this.cartRepository.clearCart(userId);
    return { message: 'Đã xóa toàn bộ giỏ hàng!' };
  }
}
