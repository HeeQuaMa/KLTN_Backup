import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PromotionsRepository } from './promotions.repository';

@Injectable()
export class PromotionsService {
  // Inject Repository vào thay vì Model
  constructor(private readonly promotionsRepo: PromotionsRepository) {}

  // 1. Tạo mới (Kiểm tra trùng mã)
  async create(createData: any) {
    const existingPromo = await this.promotionsRepo.findByCode(createData.code);
    if (existingPromo) throw new BadRequestException('Mã giảm giá này đã tồn tại!');
    
    return await this.promotionsRepo.create(createData);
  }

  // 2. Lấy danh sách
  async findAll() {
    return await this.promotionsRepo.findAll();
  }

  // 3. Sửa thông tin
  async update(id: string, updateData: any) {
    const updated = await this.promotionsRepo.update(id, updateData);
    if (!updated) throw new NotFoundException('Không tìm thấy mã giảm giá');
    return updated;
  }

  // 4. Khóa mã (Không xóa hẳn)
  async disablePromotion(id: string) {
    return await this.promotionsRepo.softDelete(id);
  }

  // 5. Logic quan trọng: Kiểm tra mã hợp lệ khi thanh toán
  async validatePromotion(code: string, orderValue: number) {
    const promo = await this.promotionsRepo.findByCode(code);
    
    if (!promo || !promo.isActive) throw new BadRequestException('Mã không hợp lệ hoặc đã bị khóa');
    
    const now = new Date();
    if (now < promo.startDate || now > promo.endDate) {
      throw new BadRequestException('Mã giảm giá không nằm trong thời gian sử dụng');
    }

    if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) {
      throw new BadRequestException('Mã giảm giá đã hết lượt sử dụng');
    }

    if (orderValue < promo.minOrderValue) {
      throw new BadRequestException(`Đơn hàng phải từ ${promo.minOrderValue}đ để áp dụng mã này`);
    }

    return promo; 
  }
}