/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order } from './schemas/order.schema';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
  ) {}

  async checkout(checkoutData: any) {
    // Ép kiểu để xử lý dữ liệu từ frontend gửi lên
    const data = checkoutData;

    const newOrder = new this.orderModel({
      user: data.userId,
      items: data.items,
      totalAmount: data.totalAmount,
    });

    return await newOrder.save();
  }
}
