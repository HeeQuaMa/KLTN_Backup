import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // POST /transactions
  @Post()
  async create(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionsService.createTransaction(createTransactionDto);
  }

  // GET /transactions?page=1&limit=10&userId=abc
  @Get()
  async findAll(
    // Đã fix: Bỏ dấu "?" và gán luôn chuỗi mặc định để TypeScript không báo lỗi undefined
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
    @Query('userId') userId?: string,
  ) {
    // Lúc này page và limit chắc chắn luôn là một chuỗi, parseInt sẽ chạy mượt mà
    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    
    return this.transactionsService.getAllTransactions(pageNumber, limitNumber, userId);
  }

  // GET /transactions/:id
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.transactionsService.getTransactionById(id);
  }
}