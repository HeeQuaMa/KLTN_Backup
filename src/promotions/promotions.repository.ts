import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Promotion, PromotionDocument } from './schemas/promotion.schema';

@Injectable()
export class PromotionsRepository {
  constructor(
    @InjectModel(Promotion.name) private promotionModel: Model<PromotionDocument>,
  ) {}

  async create(createData: any) {
    return await this.promotionModel.create(createData);
  }

  async findAll() {
    return await this.promotionModel.find().sort({ createdAt: -1 });
  }

  async findByCode(code: string) {
    return await this.promotionModel.findOne({ code });
  }

  async update(id: string, updateData: any) {
    return await this.promotionModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async softDelete(id: string) {
    return await this.promotionModel.findByIdAndUpdate(id, { isActive: false }, { new: true });
  }
}