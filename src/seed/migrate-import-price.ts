/**
 * One-time / idempotent: set importPrice ≈ 75% of price for products that lack a valid importPrice.
 *
 *   cd BE && npm run migrate:import-price
 */
import 'reflect-metadata';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const IMPORT_RATIO = 0.75;

function needsImportPrice(doc: {
  importPrice?: unknown;
  price?: unknown;
}): boolean {
  const ip = doc.importPrice;
  if (typeof ip === 'number' && Number.isFinite(ip) && ip >= 0) {
    return false;
  }
  return true;
}

function deriveImportPrice(price: unknown): number {
  const p = typeof price === 'number' && Number.isFinite(price) ? price : 0;
  return Math.round(p * IMPORT_RATIO);
}

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌ MONGODB_URI không tìm thấy trong .env');
    process.exit(1);
  }

  await mongoose.connect(uri);
  const col = mongoose.connection.collection('products');

  const docs = await col.find({}).toArray();
  let updated = 0;

  for (const doc of docs) {
    const d = doc as { importPrice?: unknown; price?: unknown };
    if (!needsImportPrice(d)) continue;
    const importPrice = deriveImportPrice(d.price);
    await col.updateOne({ _id: doc._id }, { $set: { importPrice } });
    updated += 1;
  }

  console.log(
    `✅ migrate-import-price: cập nhật ${updated} / ${docs.length} sản phẩm (importPrice = round(price × ${IMPORT_RATIO}))`,
  );

  const agg = await col
    .aggregate([
      { $match: { isActive: true } },
      {
        $project: {
          qty: { $ifNull: ['$totalStock', 0] },
          ip: { $ifNull: ['$importPrice', 0] },
        },
      },
      {
        $group: {
          _id: null,
          inventoryValue: { $sum: { $multiply: ['$ip', '$qty'] } },
        },
      },
    ])
    .toArray();
  const iv = Number(agg[0]?.inventoryValue ?? 0);
  console.log(
    `   Kiểm tra nhanh (SP active): Σ(importPrice × totalStock) ≈ ${iv.toLocaleString('vi-VN')} đ — đối chiếu thẻ KPI trên FE.`,
  );

  await mongoose.disconnect();
}

main().catch((e) => {
  console.error('❌ migrate-import-price thất bại:', e);
  process.exit(1);
});
