/* eslint-disable @typescript-eslint/no-explicit-any, no-console */
/**
 * Seed ~50 đơn COMPLETED (Jan–Apr 2026) để test Super Admin Dashboard.
 *
 * Chạy (từ thư mục BE):
 *   pnpm seed:dashboard
 *   npm run seed:dashboard
 *
 * Xóa lại bản seed cũ: đơn có orderCode bắt đầu bằng NT-2026-DASH-
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const ORDER_COUNT = 50;
const DEMO_EMAIL = 'demo.orders@nettech.vn';
const ADMIN_EMAIL = 'admin@vanlanguni.vn';
const ORDER_CODE_PREFIX = 'NT-2026-DASH-';

const MONTHS_2026_UTC = [
  { label: 'Jan', index: 0 },
  { label: 'Feb', index: 1 },
  { label: 'Mar', index: 2 },
  { label: 'Apr', index: 3 },
];

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick<T>(arr: T[]): T {
  if (arr.length === 0) throw new Error('pick: empty array');
  return arr[randomInt(0, arr.length - 1)]!;
}

function randomDateInMonthUTC(year: number, monthIndex0: number): Date {
  const lastDay = new Date(Date.UTC(year, monthIndex0 + 1, 0)).getUTCDate();
  const day = randomInt(1, lastDay);
  const h = randomInt(0, 23);
  const mi = randomInt(0, 59);
  const s = randomInt(0, 59);
  return new Date(Date.UTC(year, monthIndex0, day, h, mi, s));
}

function specHint(spec: Record<string, unknown> | null | undefined): string {
  if (!spec || typeof spec !== 'object') return '—';
  const o = spec as Record<string, unknown>;
  const parts = [o.cpu, o.processor, o.ram, o.gpu]
    .filter((v) => v != null && String(v).length > 0)
    .slice(0, 2)
    .map((v) => String(v));
  return parts.length ? parts.join(' / ') : '—';
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI không có trong .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('✅  Đã kết nối MongoDB\n');

  const db = mongoose.connection.db;
  if (!db) {
    console.error('❌  Không lấy được db handle');
    process.exit(1);
  }

  const productsCol = db.collection('products');
  const usersCol = db.collection('users');
  const ordersCol = db.collection('orders');

  const products = await productsCol
    .find({
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    })
    .limit(800)
    .toArray();

  if (products.length === 0) {
    console.error('❌  Không có sản phẩm trong DB. Chạy npm run seed trước.');
    await mongoose.disconnect();
    process.exit(1);
  }

  const demo = await usersCol.findOne({ email: DEMO_EMAIL });
  const admin = await usersCol.findOne({ email: ADMIN_EMAIL });
  const customers = await usersCol
    .find({
      isDeleted: { $ne: true },
      role: { $in: ['CUSTOMER', 'Customer', 'customer'] },
    })
    .limit(40)
    .toArray();

  const userIds: mongoose.Types.ObjectId[] = [];
  const addUser = (u: { _id?: unknown } | null) => {
    if (!u?._id) return;
    const id = u._id as mongoose.Types.ObjectId;
    if (!userIds.some((x) => x.equals(id))) userIds.push(id);
  };
  addUser(demo);
  addUser(admin);
  for (const u of customers) addUser(u);

  if (userIds.length === 0) {
    console.error(
      '❌  Không có user nào (cần demo hoặc KH). Chạy npm run seed hoặc tạo user.',
    );
    await mongoose.disconnect();
    process.exit(1);
  }

  const del = await ordersCol.deleteMany({
    orderCode: { $regex: `^${ORDER_CODE_PREFIX}` },
  });
  console.log(`🗑   Đã xóa ${del.deletedCount} đơn seed cũ (${ORDER_CODE_PREFIX}*)\n`);

  const usedCodes = new Set<string>();
  const makeCode = (): string => {
    let c: string;
    let n = 0;
    do {
      c = `${ORDER_CODE_PREFIX}${randomInt(1000, 9999)}-${randomInt(10, 99)}`;
      n++;
      if (n > 5000) throw new Error('Không tạo được orderCode unique');
    } while (usedCodes.has(c));
    usedCodes.add(c);
    return c;
  };

  let inserted = 0;

  for (let i = 0; i < ORDER_COUNT; i++) {
    const { index: monthIx } = pick(MONTHS_2026_UTC);
    const createdAt = randomDateInMonthUTC(2026, monthIx);
    const channel = Math.random() < 0.5 ? 'ONLINE' : 'O2O';
    const userId = pick(userIds);

    const lineCount = randomInt(1, 4);
    const items: any[] = [];
    let totalAmount = 0;

    for (let j = 0; j < lineCount; j++) {
      const p: any = pick(products);
      const qty = randomInt(1, 3);
      const price = Math.max(0, Math.round(Number(p.price) || 0));
      totalAmount += qty * price;
      const imgs = p.images;
      const imageUrl =
        Array.isArray(imgs) && imgs.length ? String(imgs[0]) : '';
      items.push({
        product: new mongoose.Types.ObjectId(String(p._id)),
        quantity: qty,
        price,
        productName: String(p.name ?? 'Sản phẩm'),
        variant: specHint(p.specifications as Record<string, unknown>),
        imageUrl,
      });
    }

    const orderCode = makeCode();

    await ordersCol.insertOne({
      user: userId,
      channel,
      status: 'COMPLETED',
      items,
      totalAmount,
      orderCode,
      createdAt,
      updatedAt: createdAt,
      __v: 0,
    });
    inserted++;
  }

  console.log(
    `✅  Đã tạo ${inserted} đơn COMPLETED (ONLINE + O2O), Jan–Apr 2026 UTC`,
  );
  console.log(
    `    Pool người mua: ${userIds.length} tài khoản (demo + admin + KH)\n`,
  );

  await mongoose.disconnect();
  console.log('🔌  Đã ngắt kết nối.');
}

main().catch((err) => {
  console.error('❌  seed-dashboard thất bại:', err);
  process.exit(1);
});
