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

  // 5. Logic quan trọng: Kiểm tra mã hợp lệ và TÍNH TIỀN GIẢM GIÁ
  async validatePromotion(code: string, orderValue: number) {
    // Ép kiểu code về chữ IN HOA để người dùng nhập chữ thường vẫn nhận
    const promo = await this.promotionsRepo.findByCode(code.toUpperCase());
    
    if (!promo || !promo.isActive) {
      throw new BadRequestException('Mã giảm giá không tồn tại hoặc đã bị khóa!');
    }
    
    const now = new Date();
    if (now < promo.startDate || now > promo.endDate) {
      throw new BadRequestException('Mã giảm giá không nằm trong thời gian sử dụng!');
    }

    if (promo.usageLimit > 0 && promo.usedCount >= promo.usageLimit) {
      throw new BadRequestException('Mã giảm giá này đã hết lượt sử dụng!');
    }

    if (orderValue < promo.minOrderValue) {
      throw new BadRequestException(`Đơn hàng phải từ ${promo.minOrderValue.toLocaleString('vi-VN')}đ để áp dụng mã này!`);
    }

    // ==========================================
    // PHẦN MỚI: TÍNH TOÁN SỐ TIỀN ĐƯỢC GIẢM
    // ==========================================
    let discountAmount = 0;

    if (promo.discountType === 'Fixed Amount') {
      // Trừ thẳng tiền
      discountAmount = promo.discountValue;
    } else if (promo.discountType === 'Percentage') {
      // Trừ theo phần trăm
      discountAmount = (orderValue * promo.discountValue) / 100;
      
      // Nếu có cấu hình giảm tối đa (maxDiscount) thì áp dụng
      if (promo.maxDiscount && discountAmount > promo.maxDiscount) {
        discountAmount = promo.maxDiscount;
      }
    }

    // Trả về một Object gọn gàng cho Frontend xài
    return { 
      success: true,
      message: 'Áp dụng mã giảm giá thành công!',
      code: promo.code,
      discountAmount: discountAmount 
    };
  }
}