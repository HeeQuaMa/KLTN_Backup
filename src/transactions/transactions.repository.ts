import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose'; // <-- Đã xóa chữ mongoose và FilterQuery ở đây cho sạch
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
  ) {}

  async create(data: Partial<Transaction>): Promise<TransactionDocument> {
    const newTransaction = new this.transactionModel(data);
    return newTransaction.save();
  }

  // Đã fix: Thay FilterQuery bằng Record<string, any>
  async findOne(
    query: Record<string, any>,
  ): Promise<TransactionDocument | null> {
    return this.transactionModel.findOne(query).exec();
  }

  // Đã fix: Thay FilterQuery bằng Record<string, any>
  async findAll(
    query: Record<string, any>,
    skip: number = 0,
    limit: number = 10,
  ): Promise<TransactionDocument[]> {
    return this.transactionModel
      .find(query)
      .sort({ createdAt: -1 }) // Sắp xếp giao dịch mới nhất lên đầu
      .skip(skip)
      .limit(limit)
      .populate('userId', 'name email') // Bổ sung thông tin user nếu cần
      .exec();
  }

  // Đã fix: Thay FilterQuery bằng Record<string, any>
  async countDocuments(
    query: Record<string, any>,
  ): Promise<number> {
    return this.transactionModel.countDocuments(query).exec();
  }
}