import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  StockRequest,
  StockRequestStatus,
} from './schemas/stock-request.schema';
import {
  StockTransfer,
  StockTransferStatus,
} from './schemas/stock-transfer.schema';
import { BranchInventory } from './schemas/branch-inventory.schema';

@Injectable()
export class StockManagementRepository {
  constructor(
    @InjectModel(StockRequest.name)
    private readonly stockRequestModel: Model<StockRequest>,
    @InjectModel(StockTransfer.name)
    private readonly stockTransferModel: Model<StockTransfer>,
    @InjectModel(BranchInventory.name)
    private readonly inventoryModel: Model<BranchInventory>,
  ) {}

  // ─── StockRequest ─────────────────────────────────────────────────────────

  async createRequest(data: Record<string, unknown>) {
    return await this.stockRequestModel.create(data);
  }

  // Lấy danh sách phiếu yêu cầu — lọc theo trạng thái và/hoặc chi nhánh
  async findAllRequests(filter: {
    status?: StockRequestStatus;
    branchId?: string;
  }) {
    const query: Record<string, unknown> = {};
    if (filter.status) query.status = filter.status;
    if (filter.branchId) query.branchId = new Types.ObjectId(filter.branchId);

    return await this.stockRequestModel
      .find(query)
      .populate('requester', 'fullName email')
      .populate('branchId', 'name address')
      .populate('items.productId', 'name sku')
      .sort({ createdAt: -1 })
      .lean();
  }

  async findRequestById(id: string) {
    return await this.stockRequestModel
      .findById(id)
      .populate('requester', 'fullName email')
      .populate('branchId', 'name address')
      .populate('items.productId', 'name sku')
      .lean();
  }

  // Lấy request với ObjectId gốc (KHÔNG populate) — dùng cho logic tạo Transfer
  async findRequestByIdRaw(id: string) {
    return await this.stockRequestModel.findById(id).lean();
  }

  async updateRequest(id: string, data: Record<string, unknown>) {
    return await this.stockRequestModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .lean();
  }

  // ─── StockTransfer ────────────────────────────────────────────────────────

  async createTransfer(data: Record<string, unknown>) {
    return await this.stockTransferModel.create(data);
  }

  async findAllTransfers(filter: { status?: StockTransferStatus }) {
    const query: Record<string, unknown> = {};
    if (filter.status) query.status = filter.status;

    return await this.stockTransferModel
      .find(query)
      .populate('fromBranch', 'name address')
      .populate('toBranch', 'name address')
      .populate('items.productId', 'name sku')
      .sort({ transferDate: -1 })
      .lean();
  }

  async findTransferById(id: string) {
    return await this.stockTransferModel
      .findById(id)
      .populate('fromBranch', 'name address')
      .populate('toBranch', 'name address')
      .populate('items.productId', 'name sku')
      .lean();
  }

  // Lấy transfer với ObjectId gốc (KHÔNG populate) — dùng cho logic cập nhật kho
  async findTransferByIdRaw(id: string) {
    return await this.stockTransferModel.findById(id).lean();
  }

  async updateTransfer(id: string, data: Record<string, unknown>) {
    return await this.stockTransferModel
      .findByIdAndUpdate(id, { $set: data }, { new: true })
      .lean();
  }

  // ─── BranchInventory ──────────────────────────────────────────────────────

  // Lấy toàn bộ tồn kho của một chi nhánh
  async findInventoryByBranch(branchId: string) {
    return await this.inventoryModel
      .find({ branchId: new Types.ObjectId(branchId) })
      .populate('productId', 'name sku price')
      .lean();
  }

  // Tăng/giảm số lượng tồn kho tại một chi nhánh cho một sản phẩm.
  // upsert: true → tự tạo mới nếu chưa có bản ghi (branchId + productId)
  async adjustInventory(
    branchId: Types.ObjectId,
    productId: Types.ObjectId,
    delta: number, // Dương = nhập thêm, âm = xuất đi
  ) {
    return await this.inventoryModel.findOneAndUpdate(
      { branchId, productId },
      { $inc: { quantity: delta } },
      { upsert: true, new: true },
    );
  }
}
