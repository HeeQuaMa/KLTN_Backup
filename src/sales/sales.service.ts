/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from './schemas/order.schema';
import { Product } from '../products/schemas/product.schema';
import { User } from '../users/schemas/user.schema';
import type { AdminOrdersQueryDto } from './dto/admin-orders.dto';

@Injectable()
export class SalesService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  private makeOrderCode(): string {
    const y = new Date().getFullYear();
    const n = Math.floor(1000 + Math.random() * 9000);
    return `NT-${y}-${n}`;
  }

  /** Ảnh path tương đối (/uploads/...) cần origin BE để Next (port 3000) hiển thị đúng */
  private absolutizeAssetUrl(url: string): string {
    const u = (url || '').trim();
    if (!u) return '';
    if (/^https?:\/\//i.test(u)) return u;
    const base = (process.env.PUBLIC_API_URL || '').replace(/\/$/, '');
    const path = u.startsWith('/') ? u : `/${u}`;
    return base ? `${base}${path}` : path;
  }

  private specSummary(specifications: Record<string, unknown> | null | undefined): string {
    if (!specifications || typeof specifications !== 'object') return '—';
    const s = specifications as Record<string, unknown>;
    const cpu = s.cpu != null ? String(s.cpu) : s.processor != null ? String(s.processor) : '';
    const ram = s.ram != null ? String(s.ram) : '';
    const storage = s.storage != null ? String(s.storage) : '';
    const gpu = s.gpu != null ? String(s.gpu) : '';
    const parts = [cpu, ram || storage, storage].filter(Boolean);
    if (parts.length) return [...new Set(parts)].slice(0, 4).join(' / ');
    const vals = Object.values(s)
      .filter((v) => v != null && typeof v !== 'object')
      .slice(0, 3)
      .map(String);
    return vals.length ? vals.join(' / ') : '—';
  }

  async checkout(userId: string, checkoutData: any) {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      throw new BadRequestException(
        'Không xác định được người dùng (gửi userId trong body hoặc Bearer token hợp lệ).',
      );
    }

    const data = checkoutData;
    const itemsRaw = Array.isArray(data.items) ? data.items : [];

    const items: any[] = [];
    for (const line of itemsRaw) {
      const pid = line.product;
      let productRef: Types.ObjectId | undefined;
      let productName = 'Sản phẩm';
      let variant = '—';
      let imageUrl = '';
      if (pid && Types.ObjectId.isValid(String(pid))) {
        productRef = new Types.ObjectId(String(pid));
        const prod = await this.productModel.findById(pid).lean();
        if (prod) {
          productName = (prod as any).name ?? productName;
          variant = this.specSummary(
            (prod as any).specifications as Record<string, unknown>,
          );
          const imgs = (prod as any).images;
          const rawImg =
            Array.isArray(imgs) && imgs.length ? String(imgs[0]) : '';
          imageUrl = this.absolutizeAssetUrl(rawImg);
        }
      }
      items.push({
        product: productRef,
        quantity: Number(line.quantity) || 1,
        price: Number(line.price) || 0,
        productName,
        variant,
        imageUrl,
      });
    }

    const newOrder = new this.orderModel({
      user: new Types.ObjectId(userId),
      items,
      totalAmount: Number(data.totalAmount) || 0,
      orderCode: this.makeOrderCode(),
      channel: data.channel === 'O2O' ? 'O2O' : 'ONLINE',
      status: 'PENDING_CONFIRMATION',
    });

    return await newOrder.save();
  }

  async findMyOrders(userId: string, statusFilter?: string) {
    if (!userId || !Types.ObjectId.isValid(userId)) {
      return { orders: [] };
    }

    const filter: Record<string, unknown> = {
      user: new Types.ObjectId(userId),
    };

    const sf = statusFilter?.trim().toUpperCase();
    if (
      sf &&
      [
        'PENDING_CONFIRMATION',
        'SHIPPING',
        'COMPLETED',
        'CANCELLED',
      ].includes(sf)
    ) {
      if (sf === 'PENDING_CONFIRMATION') {
        filter.$or = [
          { status: 'PENDING_CONFIRMATION' },
          { status: 'PENDING' },
        ];
      } else {
        filter.status = sf;
      }
    }

    const rows = await this.orderModel
      .find(filter)
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return { orders: rows.map((doc) => this.mapOrderDoc(doc)) };
  }

  private mapOrderDoc(raw: any) {
    const codeRaw =
      raw.orderCode ||
      `LEGACY-${String(raw._id).replace(/[^a-fA-F0-9]/g, '').slice(-10).toUpperCase()}`;
    const status =
      raw.status === 'PENDING' ? 'PENDING_CONFIRMATION' : raw.status;

    const items = (raw.items || []).map((it: any) => ({
      product: it.product ? String(it.product) : undefined,
      quantity: Number(it.quantity) || 1,
      price: Number(it.price) || 0,
      productName: it.productName || undefined,
      variant: it.variant || undefined,
      imageUrl: it.imageUrl || undefined,
    }));

    return {
      orderCode: codeRaw,
      createdAt: raw.createdAt,
      status,
      channel: raw.channel === 'O2O' ? 'O2O' : 'ONLINE',
      totalAmount: Number(raw.totalAmount) || 0,
      items,
    };
  }

  // ─── Admin (Super Admin) — Quản lý đơn hàng ─────────────────────────────

  private escapeRegex(s: string) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /** Nhãn ngày filter (theo giờ máy chủ local). */
  private resolveDateRange(
    preset: string | undefined,
  ): { start?: Date; end?: Date } {
    if (!preset || preset === 'all') return {};
    const now = new Date();
    if (preset === 'today') {
      const s = new Date(now);
      s.setHours(0, 0, 0, 0);
      const e = new Date(now);
      e.setHours(23, 59, 59, 999);
      return { start: s, end: e };
    }
    if (preset === 'week') {
      const s = new Date(now);
      const day = s.getDay();
      const diff = s.getDate() - day + (day === 0 ? -6 : 1);
      s.setDate(diff);
      s.setHours(0, 0, 0, 0);
      const e = new Date(now);
      e.setHours(23, 59, 59, 999);
      return { start: s, end: e };
    }
    if (preset === 'month') {
      const s = new Date(now.getFullYear(), now.getMonth(), 1);
      const e = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );
      return { start: s, end: e };
    }
    return {};
  }

  async getAdminStats(datePreset?: string) {
    const r = this.resolveDateRange(datePreset ?? 'all');
    const timeMatch =
      r.start && r.end
        ? { createdAt: { $gte: r.start, $lte: r.end } }
        : {};

    const [pendingOnline, packing, shipping, cancelled] =
      await Promise.all([
        this.orderModel.countDocuments({
          ...timeMatch,
          channel: 'ONLINE',
          $or: [
            { status: 'PENDING_CONFIRMATION' },
            { status: 'PENDING' },
          ],
        }),
        this.orderModel.countDocuments({ ...timeMatch, status: 'PACKING' }),
        this.orderModel.countDocuments({ ...timeMatch, status: 'SHIPPING' }),
        this.orderModel.countDocuments({ ...timeMatch, status: 'CANCELLED' }),
      ]);

    return { pendingOnline, packing, shipping, cancelled };
  }

  async findAdminOrders(query: AdminOrdersQueryDto) {
    const tab = query.tab ?? 'all';
    const channel = query.channel ?? 'all';
    const datePreset = query.date ?? 'all';
    const qRaw = query.q?.trim();

    const and: Record<string, unknown>[] = [];
    const dr = this.resolveDateRange(datePreset);
    if (dr.start && dr.end) {
      and.push({ createdAt: { $gte: dr.start, $lte: dr.end } });
    }

    if (channel === 'ONLINE') and.push({ channel: 'ONLINE' });
    if (channel === 'O2O') and.push({ channel: 'O2O' });

    if (tab === 'pending') {
      and.push({
        $or: [{ status: 'PENDING_CONFIRMATION' }, { status: 'PENDING' }],
      });
    } else if (tab === 'processing') {
      and.push({ status: { $in: ['PACKING', 'SHIPPING'] } });
    } else if (tab === 'completed') {
      and.push({ status: 'COMPLETED' });
    }

    if (qRaw) {
      const esc = this.escapeRegex(qRaw);
      const users = await this.userModel
        .find({
          $or: [
            { phone: new RegExp(esc, 'i') },
            { email: new RegExp(esc, 'i') },
            { fullName: new RegExp(esc, 'i') },
          ],
          isDeleted: { $ne: true },
        })
        .select('_id')
        .lean()
        .exec();
      const uids = users.map((u) => u._id);
      and.push({
        $or: [{ orderCode: new RegExp(esc, 'i') }, { user: { $in: uids } }],
      });
    }

    const filter = and.length === 0 ? {} : { $and: and };

    const rows = await this.orderModel
      .find(filter)
      .populate('user', 'fullName phone email')
      .sort({ createdAt: -1 })
      .limit(500)
      .lean()
      .exec();

    return rows.map((doc) => this.mapAdminRow(doc));
  }

  async getAdminOrdersPage(query: AdminOrdersQueryDto) {
    const dateForStats = query.date ?? 'all';
    const [stats, orders] = await Promise.all([
      this.getAdminStats(dateForStats),
      this.findAdminOrders(query),
    ]);
    return { stats, orders };
  }

  private mapAdminRow(raw: any) {
    const u = raw.user as
      | { fullName?: string; phone?: string; email?: string }
      | null;
    const codeRaw =
      raw.orderCode ||
      `LEGACY-${String(raw._id).replace(/[^a-fA-F0-9]/g, '').slice(-10).toUpperCase()}`;
    const code = codeRaw.startsWith('#') ? codeRaw : `#${codeRaw}`;
    let status =
      raw.status === 'PENDING' ? 'PENDING_CONFIRMATION' : raw.status;
    return {
      _id: String(raw._id),
      orderCode: code,
      createdAt: raw.createdAt,
      customerName:
        u?.fullName?.trim() ||
        (raw.channel === 'O2O' ? 'Khách lẻ' : '—'),
      customerPhone:
        u?.phone?.trim() || u?.email?.trim() || '--',
      totalAmount: Number(raw.totalAmount) || 0,
      channel: raw.channel === 'O2O' ? 'O2O' : 'ONLINE',
      status,
    };
  }

  async updateOrderStatus(orderId: string, status: string) {
    if (!Types.ObjectId.isValid(orderId)) {
      throw new BadRequestException('Id đơn hàng không hợp lệ');
    }
    const allowed = new Set([
      'PENDING_CONFIRMATION',
      'PACKING',
      'SHIPPING',
      'COMPLETED',
      'CANCELLED',
      'PENDING',
    ]);
    if (!allowed.has(status)) {
      throw new BadRequestException('Trạng thái không hợp lệ');
    }
    const doc = await this.orderModel
      .findByIdAndUpdate(orderId, { status }, { new: true })
      .populate('user', 'fullName phone email')
      .lean()
      .exec();
    if (!doc) {
      throw new NotFoundException('Không tìm thấy đơn hàng');
    }
    return this.mapAdminRow(doc);
  }
}
