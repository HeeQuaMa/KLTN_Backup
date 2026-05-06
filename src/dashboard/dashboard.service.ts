/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order } from '../sales/schemas/order.schema';
import { User } from '../users/schemas/user.schema';
import { Product } from '../products/schemas/product.schema';

const LOW_STOCK_THRESHOLD = 10;

function monthRangeUTC(year: number, month1: number): { start: Date; end: Date } {
  const start = new Date(Date.UTC(year, month1 - 1, 1, 0, 0, 0, 0));
  const end = new Date(Date.UTC(year, month1, 0, 23, 59, 59, 999));
  return { start, end };
}

function prevMonth(year: number, month1: number): { year: number; month: number } {
  if (month1 === 1) return { year: year - 1, month: 12 };
  return { year, month: month1 - 1 };
}

function growthPercent(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 100);
}

function weekIndexFromDay(dayOfMonth: number): number {
  if (dayOfMonth <= 7) return 1;
  if (dayOfMonth <= 14) return 2;
  if (dayOfMonth <= 21) return 3;
  return 4;
}

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  resolvePeriod(queryYear?: number, queryMonth?: number): {
    year: number;
    month: number;
    label: string;
  } {
    const now = new Date();
    const year = queryYear ?? now.getUTCFullYear();
    const month = queryMonth ?? now.getUTCMonth() + 1;
    const label = `${String(month).padStart(2, '0')}/${year}`;
    return { year, month, label };
  }

  async getStats(year?: number, month?: number) {
    const { year: y, month: m, label } = this.resolvePeriod(year, month);
    const { start, end } = monthRangeUTC(y, m);
    const pv = prevMonth(y, m);
    const { start: pStart, end: pEnd } = monthRangeUTC(pv.year, pv.month);

    const [
      revenueCurr,
      revenuePrev,
      ordersCurr,
      ordersPrev,
      customersCurr,
      customersPrev,
      lowStock,
    ] = await Promise.all([
      this.orderModel
        .aggregate<{ t: number }>([
          {
            $match: {
              status: 'COMPLETED',
              createdAt: { $gte: start, $lte: end },
            },
          },
          { $group: { _id: null, t: { $sum: '$totalAmount' } } },
        ])
        .exec(),
      this.orderModel
        .aggregate<{ t: number }>([
          {
            $match: {
              status: 'COMPLETED',
              createdAt: { $gte: pStart, $lte: pEnd },
            },
          },
          { $group: { _id: null, t: { $sum: '$totalAmount' } } },
        ])
        .exec(),
      this.orderModel.countDocuments({
        createdAt: { $gte: start, $lte: end },
      }),
      this.orderModel.countDocuments({
        createdAt: { $gte: pStart, $lte: pEnd },
      }),
      this.userModel.countDocuments({
        role: { $in: ['CUSTOMER', 'Customer', 'customer'] },
        isDeleted: { $ne: true },
        createdAt: { $gte: start, $lte: end },
      }),
      this.userModel.countDocuments({
        role: { $in: ['CUSTOMER', 'Customer', 'customer'] },
        isDeleted: { $ne: true },
        createdAt: { $gte: pStart, $lte: pEnd },
      }),
      this.productModel.countDocuments({
        isActive: { $ne: false },
        totalStock: { $lt: LOW_STOCK_THRESHOLD },
      }),
    ]);

    const totalRevenue = revenueCurr[0]?.t ?? 0;
    const totalRevenuePrev = revenuePrev[0]?.t ?? 0;

    return {
      period: { year: y, month: m, label },
      lowStockThreshold: LOW_STOCK_THRESHOLD,
      totalRevenue,
      totalRevenueGrowthPercent: growthPercent(
        totalRevenue,
        totalRevenuePrev,
      ),
      totalOrders: ordersCurr,
      totalOrdersGrowthPercent: growthPercent(ordersCurr, ordersPrev),
      newCustomers: customersCurr,
      newCustomersGrowthPercent: growthPercent(customersCurr, customersPrev),
      lowStockProducts: lowStock,
    };
  }

  async getRevenueChart(year?: number, month?: number) {
    const { year: y, month: m } = this.resolvePeriod(year, month);
    const { start, end } = monthRangeUTC(y, m);

    const orders = await this.orderModel
      .find({
        status: 'COMPLETED',
        createdAt: { $gte: start, $lte: end },
      })
      .select({ totalAmount: 1, channel: 1, createdAt: 1 })
      .lean()
      .exec();

    const weeks = [1, 2, 3, 4].map((w) => ({
      week: w,
      label: `Tuần ${w}`,
      online: 0,
      offline: 0,
    }));

    for (const o of orders) {
      const raw = o as {
        createdAt?: Date;
        totalAmount?: number;
        channel?: string;
      };
      const d = new Date(raw.createdAt as Date);
      const dom = d.getUTCDate();
      const wi = weekIndexFromDay(dom) - 1;
      const amt = Number(raw.totalAmount) || 0;
      if (raw.channel === 'O2O') weeks[wi].offline += amt;
      else weeks[wi].online += amt;
    }

    return {
      year: y,
      month: m,
      weeks: weeks.map((w) => ({
        label: w.label,
        online: w.online,
        offline: w.offline,
      })),
    };
  }

  async getTopProducts(year?: number, month?: number, limit = 3) {
    const { year: y, month: m } = this.resolvePeriod(year, month);
    const { start, end } = monthRangeUTC(y, m);

    const rows = await this.orderModel
      .aggregate<{
        _id: Types.ObjectId | null;
        sold: number;
        nameGuess: string | null;
      }>([
        {
          $match: {
            status: 'COMPLETED',
            createdAt: { $gte: start, $lte: end },
          },
        },
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.product',
            sold: { $sum: '$items.quantity' },
            nameGuess: { $first: '$items.productName' },
          },
        },
        { $sort: { sold: -1 } },
        { $limit: limit },
      ])
      .exec();

    const out: {
      rank: number;
      productId: string | null;
      name: string;
      soldQuantity: number;
    }[] = [];

    let rank = 0;
    for (const r of rows) {
      rank += 1;
      let name = r.nameGuess || 'Sản phẩm';
      if (r._id && Types.ObjectId.isValid(String(r._id))) {
        const p = await this.productModel
          .findById(r._id)
          .select({ name: 1 })
          .lean();
        if (p && (p as any).name) name = String((p as any).name);
      }
      out.push({
        rank,
        productId: r._id ? String(r._id) : null,
        name,
        soldQuantity: r.sold,
      });
    }

    return { products: out };
  }

  private statusLabel(status: string): string {
    const s = status === 'PENDING' ? 'PENDING_CONFIRMATION' : status;
    const map: Record<string, string> = {
      PENDING_CONFIRMATION: 'Chờ xử lý',
      SHIPPING: 'Đang giao',
      COMPLETED: 'Hoàn thành',
      CANCELLED: 'Đã hủy',
    };
    return map[s] ?? status;
  }

  private channelLabel(channel: string): string {
    return channel === 'O2O' ? 'Tại quầy (POS)' : 'Website';
  }

  async getRecentOrders(year?: number, month?: number, limit = 5) {
    const { year: y, month: m } = this.resolvePeriod(year, month);
    const { start, end } = monthRangeUTC(y, m);

    const rows = await this.orderModel
      .find({ createdAt: { $gte: start, $lte: end } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'fullName email')
      .lean()
      .exec();

    return {
      orders: rows.map((o: any) => {
        const code =
          o.orderCode != null && String(o.orderCode).length
            ? String(o.orderCode)
            : `LEGACY-${String(o._id).slice(-8)}`;
        const u = o.user as { fullName?: string; email?: string } | null;
        const customerName =
          u?.fullName?.trim() ||
          u?.email ||
          (o.channel === 'O2O' ? 'Khách lẻ' : '—');
        const st = String(o.status ?? '');
        return {
          orderCode: code.startsWith('#') ? code : `#${code}`,
          customerName,
          createdAt: o.createdAt,
          totalAmount: Number(o.totalAmount) || 0,
          status: st,
          statusLabel: this.statusLabel(st),
          channel: o.channel === 'O2O' ? 'O2O' : 'ONLINE',
          channelLabel: this.channelLabel(o.channel === 'O2O' ? 'O2O' : 'ONLINE'),
        };
      }),
    };
  }
}
