import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { StockManagementRepository } from './stock-management.repository';
import { StockRequestStatus } from './schemas/stock-request.schema';
import { StockTransferStatus } from './schemas/stock-transfer.schema';

@Injectable()
export class StockManagementService {
  constructor(private readonly repo: StockManagementRepository) {}

  // ─── StockRequest ─────────────────────────────────────────────────────────

  // Tạo phiếu yêu cầu hàng mới
  async createRequest(data: any) {
    return await this.repo.createRequest(data as Record<string, unknown>);
  }

  // Lấy danh sách phiếu yêu cầu — có thể lọc theo trạng thái và/hoặc chi nhánh
  async getAllRequests(status?: string, branchId?: string) {
    return await this.repo.findAllRequests({
      status: status as StockRequestStatus,
      branchId,
    });
  }

  // Lấy chi tiết một phiếu yêu cầu
  async getRequestById(id: string) {
    const request = await this.repo.findRequestById(id);
    if (!request) throw new NotFoundException('Không tìm thấy phiếu yêu cầu!');
    return request;
  }

  /**
   * Duyệt (APPROVED) / Từ chối (REJECTED) / Hoàn thành (COMPLETED) phiếu yêu cầu.
   *
   * ⚡ Khi newStatus = APPROVED:
   *   - Lấy request gốc (raw ObjectId)
   *   - Tự động tạo một StockTransfer mới với:
   *       fromBranch  = request.sourceBranchId  (kho xuất — có thể null)
   *       toBranch    = request.branchId         (chi nhánh cần hàng)
   *       items       = request.items            (cùng danh sách sản phẩm)
   *       sourceRequestId = request._id          (để truy vết)
   *   - Phiếu Transfer được tạo với status = SHIPPING mặc định
   */
  async updateRequestStatus(
    id: string,
    status: StockRequestStatus,
    note?: string,
    sourceBranchId?: string, // Kho xuất — truyền vào khi duyệt (APPROVED)
  ) {
    // Cập nhật trạng thái và sourceBranchId (nếu có) vào Request
    const updateData: Record<string, unknown> = { status };
    if (note !== undefined) updateData.note = note;
    if (sourceBranchId) updateData.sourceBranchId = sourceBranchId;

    const updated = await this.repo.updateRequest(id, updateData);
    if (!updated) throw new NotFoundException('Không tìm thấy phiếu yêu cầu!');

    // ─── Tự động tạo StockTransfer khi phiếu được duyệt ─────────────────
    if (status === StockRequestStatus.APPROVED) {
      // Lấy request gốc với ObjectId thực (không populate)
      const raw = await this.repo.findRequestByIdRaw(id);

      if (raw) {
        await this.repo.createTransfer({
          // Kho xuất: ưu tiên sourceBranchId truyền vào, fallback sang field trong DB
          fromBranch: sourceBranchId ?? raw.sourceBranchId ?? null,
          // Chi nhánh nhận hàng = chi nhánh đã yêu cầu
          toBranch: raw.branchId,
          // Copy nguyên danh sách sản phẩm từ Request
          items: (
            raw.items as Array<{ productId: Types.ObjectId; quantity: number }>
          ).map(({ productId, quantity }) => ({ productId, quantity })),
          // Trạng thái khởi tạo: đang chuẩn bị vận chuyển
          status: 'SHIPPING',
          // Liên kết ngược về Request đã sinh ra Transfer này
          sourceRequestId: raw._id,
          transferDate: new Date(),
        });
      }
    }

    return updated;
  }

  // ─── StockTransfer ────────────────────────────────────────────────────────

  // Tạo lệnh điều chuyển hàng mới
  async createTransfer(data: any) {
    return await this.repo.createTransfer(data as Record<string, unknown>);
  }

  // Lấy danh sách phiếu chuyển hàng — có thể lọc theo trạng thái
  async getAllTransfers(status?: string) {
    return await this.repo.findAllTransfers({
      status: status as StockTransferStatus,
    });
  }

  // Lấy chi tiết một phiếu chuyển hàng
  async getTransferById(id: string) {
    const transfer = await this.repo.findTransferById(id);
    if (!transfer)
      throw new NotFoundException('Không tìm thấy phiếu chuyển hàng!');
    return transfer;
  }

  /**
   * Cập nhật trạng thái phiếu chuyển hàng.
   *
   * ⚡ Logic quan trọng khi chuyển sang DELIVERED:
   *   - Lấy phiếu transfer gốc (raw ObjectId, chưa populate)
   *   - Duyệt qua từng dòng items
   *   - Trừ số lượng ở kho xuất (fromBranch)
   *   - Cộng số lượng ở kho nhập (toBranch)
   *   - Dùng $inc + upsert → an toàn khi chạy đồng thời
   */
  async updateTransferStatus(id: string, status: StockTransferStatus) {
    // Lấy transfer gốc trước khi cập nhật để đọc fromBranch, toBranch, items
    const raw = await this.repo.findTransferByIdRaw(id);
    if (!raw) throw new NotFoundException('Không tìm thấy phiếu chuyển hàng!');

    // Không cho phép cập nhật trạng thái của phiếu đã huỷ
    if (raw.status === StockTransferStatus.CANCELLED) {
      throw new BadRequestException(
        'Phiếu đã bị huỷ, không thể cập nhật trạng thái!',
      );
    }

    // Cập nhật trạng thái trước
    const updated = await this.repo.updateTransfer(id, { status });

    // ─── Khi hàng đã đến nơi: cập nhật tồn kho 2 chi nhánh ───────────────
    if (status === StockTransferStatus.DELIVERED) {
      const fromBranchId = raw.fromBranch as Types.ObjectId;
      const toBranchId = raw.toBranch as Types.ObjectId;

      // Cập nhật song song toàn bộ dòng sản phẩm để nhanh hơn
      const inventoryUpdates = (
        raw.items as Array<{
          productId: Types.ObjectId;
          quantity: number;
        }>
      ).map(({ productId, quantity }) =>
        Promise.all([
          // Trừ kho xuất
          this.repo.adjustInventory(fromBranchId, productId, -quantity),
          // Cộng kho nhập
          this.repo.adjustInventory(toBranchId, productId, quantity),
        ]),
      );

      await Promise.all(inventoryUpdates);
    }

    return updated;
  }

  // ─── BranchInventory ──────────────────────────────────────────────────────

  // Xem tồn kho hiện tại của một chi nhánh
  async getInventoryByBranch(branchId: string) {
    return await this.repo.findInventoryByBranch(branchId);
  }
}
