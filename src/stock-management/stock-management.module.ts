import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  StockRequestsController,
  StockTransfersController,
  BranchInventoryController,
} from './stock-management.controller';
import { StockManagementService } from './stock-management.service';
import { StockManagementRepository } from './stock-management.repository';
import {
  StockRequest,
  StockRequestSchema,
} from './schemas/stock-request.schema';
import {
  StockTransfer,
  StockTransferSchema,
} from './schemas/stock-transfer.schema';
import {
  BranchInventory,
  BranchInventorySchema,
} from './schemas/branch-inventory.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: StockRequest.name, schema: StockRequestSchema },
      { name: StockTransfer.name, schema: StockTransferSchema },
      { name: BranchInventory.name, schema: BranchInventorySchema },
    ]),
  ],
  controllers: [
    StockRequestsController,
    StockTransfersController,
    BranchInventoryController,
  ],
  providers: [StockManagementService, StockManagementRepository],
  exports: [StockManagementService],
})
export class StockManagementModule {}
