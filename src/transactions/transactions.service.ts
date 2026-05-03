import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from './transactions.repository';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { v4 as uuidv4 } from 'uuid'; // Chạy npm install uuid để dùng

@Injectable()
export class TransactionsService {
  constructor(private readonly transactionsRepository: TransactionsRepository) {}

  async createTransaction(createDto: CreateTransactionDto) {
    // Tự động sinh transactionCode (VD: TXN-timestamp-uuid)
    const transactionCode = `TXN-${Date.now()}-${uuidv4().split('-')[0].toUpperCase()}`;

    const newTransactionData = {
      ...createDto,
      transactionCode,
      // Status mặc định sẽ lấy từ Schema (Pending)
    };

    return this.transactionsRepository.create(newTransactionData);
  }

  async getTransactionById(id: string) {
    const transaction = await this.transactionsRepository.findOne({ _id: id });
    if (!transaction) {
      throw new NotFoundException(`Transaction with ID ${id} not found`);
    }
    return transaction;
  }

  async getAllTransactions(page: number = 1, limit: number = 10, userId?: string) {
    const skip = (page - 1) * limit;
    
    // Khởi tạo query filter, hỗ trợ lọc theo userId
    const query: any = {};
    if (userId) {
      query.userId = userId;
    }

    const [data, total] = await Promise.all([
      this.transactionsRepository.findAll(query, skip, limit),
      this.transactionsRepository.countDocuments(query),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}