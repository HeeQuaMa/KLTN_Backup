import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../products/schemas/product.schema';
import { InventoryAdminQueryDto } from './dto/inventory-admin.dto';

type LocRow = { location: string; stock: number };

const BRANCH_ALIASES: Record<string, string[]> = {
  q5: ['quận 5', 'q5', 'q.5', 'quan 5'],
  q1: ['quận 1', 'q1', 'q.1', 'quan 1'],
  q10: ['quận 10', 'q10', 'q.10', 'quan 10'],
};

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function locationMatchesBranch(loc: string, branchKey: string): boolean {
  const L = loc.trim().toLowerCase();
  const aliases = BRANCH_ALIASES[branchKey];
  if (!aliases) return false;
  return aliases.some((a) => L === a || L.includes(a));
}

function displayLocationLabel(loc: string): string {
  const L = loc.trim();
  const lower = L.toLowerCase();
  if (lower.includes('quận 5') || lower === 'q5') return 'Q5';
  if (lower.includes('quận 1') || lower === 'q1') return 'Q1';
  if (lower.includes('quận 10') || lower === 'q10') return 'Q10';
  return L;
}

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel('Product') private readonly productModel: Model<Product>,
  ) {}

  private resolveLocations(p: {
    stockByLocation?: LocRow[];
    totalStock?: number;
  }): LocRow[] {
    const raw = p.stockByLocation ?? [];
    const cleaned = raw.filter(
      (x) =>
        x &&
        typeof x.location === 'string' &&
        typeof x.stock === 'number' &&
        x.stock >= 0,
    );
    if (cleaned.length > 0) return cleaned;
    const ts = typeof p.totalStock === 'number' ? p.totalStock : 0;
    return [{ location: 'Kho chung', stock: ts }];
  }

  private stockForBranch(locs: LocRow[], branchKey: string | null): number {
    if (!branchKey) {
      return locs.reduce((s, x) => s + x.stock, 0);
    }
    return locs
      .filter((l) => locationMatchesBranch(l.location, branchKey))
      .reduce((s, x) => s + x.stock, 0);
  }

  private fullStockTotal(locs: LocRow[]): number {
    return locs.reduce((s, x) => s + x.stock, 0);
  }

  /** Giá nhập hiển thị & KPI: DB hoặc ướclượng 75% giá bán nếu chưa có. */
  private effectiveImportPrice(p: {
    importPrice?: number;
    price: number;
  }): number {
    const ip = p.importPrice;
    if (typeof ip === 'number' && !Number.isNaN(ip) && ip >= 0) {
      return ip;
    }
    const sell =
      typeof p.price === 'number' && !Number.isNaN(p.price) ? p.price : 0;
    return Math.round(sell * 0.75);
  }

  private formatBreakdown(locs: LocRow[]): string {
    const parts = locs
      .filter((l) => l.stock > 0)
      .map((l) => `${displayLocationLabel(l.location)}: ${l.stock}`);
    if (parts.length === 0) return '';
    return `(${parts.join(', ')})`;
  }

  async getAdminInventory(query: InventoryAdminQueryDto) {
    const branchRaw = query.branch?.trim() || 'all';
    const branchKey = branchRaw === 'all' ? null : branchRaw;
    const q = query.q?.trim();

    const filter: Record<string, unknown> = { isActive: true };
    if (q) {
      const rx = new RegExp(escapeRegex(q), 'i');
      filter.$or = [{ sku: rx }, { name: rx }];
    }

    const products = await this.productModel
      .find(filter)
      .populate('category', 'name')
      .lean()
      .exec();

    let lowStockCount = 0;
    let inventoryValue = 0;

    const rows = products.map((p) => {
      const locs = this.resolveLocations(p);
      const displayTotal = this.stockForBranch(locs, branchKey);
      const fullStockTotal = this.fullStockTotal(locs);
      const importPrice = this.effectiveImportPrice(p);

      if (displayTotal < 10) {
        lowStockCount += 1;
      }
      // Giá trị tồn kho (KPI): tổng trên toàn bộ tồn thực tế × giá nhập
      inventoryValue += importPrice * fullStockTotal;

      const cat = p.category as { name?: string } | null;
      const categoryName =
        cat && typeof cat.name === 'string' ? cat.name : '—';

      return {
        _id: String(p._id),
        sku: typeof p.sku === 'string' && p.sku ? p.sku : '—',
        name: p.name,
        categoryName,
        totalStock: displayTotal,
        stockBreakdown: this.formatBreakdown(locs),
        importPrice,
        sellPrice: p.price,
        status: displayTotal > 0 ? ('Sẵn hàng' as const) : ('Hết hàng' as const),
      };
    });

    rows.sort((a, b) => a.name.localeCompare(b.name, 'vi'));

    const totalSkus = rows.length;

    return {
      stats: {
        totalSkus,
        lowStockCount,
        inventoryValue,
      },
      rows,
    };
  }
}
