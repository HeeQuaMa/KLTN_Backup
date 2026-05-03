import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartItem } from './schemas/cart.schema';

// Repository chịu trách nhiệm giao tiếp trực tiếp với MongoDB
@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart>,
  ) {}

  // Lấy giỏ hàng của một user, tạo mới nếu chưa tồn tại
  async findOrCreateByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartModel.findOne({ userId }).exec();
    if (cart) return cart;
    return await this.cartModel.create({ userId, items: [] });
  }

  // Lấy giỏ hàng theo userId (trả về null nếu chưa có)
  async findByUserId(userId: string): Promise<Cart | null> {
    return await this.cartModel.findOne({ userId }).exec();
  }

  // Thêm item mới vào mảng items (chỉ gọi khi cartItemId chưa tồn tại)
  async pushItem(userId: string, item: CartItem): Promise<Cart | null> {
    return await this.cartModel
      .findOneAndUpdate({ userId }, { $push: { items: item } }, { new: true })
      .exec();
  }

  // Tăng số lượng của item đã có trong giỏ (dùng $inc trên phần tử mảng)
  async incrementQuantity(
    userId: string,
    cartItemId: string,
    amount: number,
  ): Promise<Cart | null> {
    return await this.cartModel
      .findOneAndUpdate(
        { userId, 'items.cartItemId': cartItemId },
        { $inc: { 'items.$.quantity': amount } },
        { new: true },
      )
      .exec();
  }

  // Cập nhật số lượng chính xác (dùng $set — khớp với updateQuantity trong FE)
  async setQuantity(
    userId: string,
    cartItemId: string,
    quantity: number,
  ): Promise<Cart | null> {
    return await this.cartModel
      .findOneAndUpdate(
        { userId, 'items.cartItemId': cartItemId },
        { $set: { 'items.$.quantity': quantity } },
        { new: true },
      )
      .exec();
  }

  // Xóa item khỏi mảng theo cartItemId (khớp với removeItem trong FE)
  async removeItem(userId: string, cartItemId: string): Promise<Cart | null> {
    return await this.cartModel
      .findOneAndUpdate(
        { userId },
        { $pull: { items: { cartItemId } } },
        { new: true },
      )
      .exec();
  }

  // Xóa toàn bộ giỏ hàng (dùng khi clearCart hoặc sau khi đặt hàng thành công)
  async clearCart(userId: string): Promise<Cart | null> {
    return await this.cartModel
      .findOneAndUpdate({ userId }, { $set: { items: [] } }, { new: true })
      .exec();
  }
}
