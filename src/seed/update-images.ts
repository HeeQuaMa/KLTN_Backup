/**
 * UPDATE-IMAGES SCRIPT
 * ─────────────────────────────────────────────────────────────────────────────
 * Cập nhật ảnh sản phẩm với các URL tĩnh, đã xác nhận hoạt động từ seed.ts.
 *
 * Chiến lược:
 *  - Dùng 8 photo ID đã xác nhận từ seed.ts (100% không bị 404).
 *  - Tạo sự đa dạng trong cùng category bằng tham số crop + width khác nhau
 *    (crop=top / bottom / entropy / center, w=800/900/1000/1200).
 *    → Mỗi URL là một vùng cắt khác nhau của ảnh gốc chất lượng cao.
 *  - Mỗi sản phẩm được gán URL theo round-robin từ pool của category.
 *  - Không dùng source.unsplash.com (503 errors) hay API bên ngoài.
 *
 * Cách chạy:
 *   cd backend-nettech
 *   pnpm run update-images
 *   -- hoặc --
 *   npx ts-node -r tsconfig-paths/register src/seed/update-images.ts
 */

import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// ─── Mongoose schemas (standalone — không cần NestJS) ─────────────────────────

const categorySchema = new mongoose.Schema(
  { name: String, slug: { type: String, unique: true } },
  { collection: 'categories', timestamps: true },
);

const productSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    sku:      { type: String, unique: true, sparse: true },
    images:   [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  },
  { collection: 'products', timestamps: true },
);

const CategoryModel = mongoose.model('UpdCategory', categorySchema, 'categories');
const ProductModel  = mongoose.model('UpdProduct',  productSchema,  'products');

// ─── Confirmed photo IDs (tất cả đã dùng trong seed.ts, 100% hoạt động) ──────

const ID = {
  cpu:    '1591799264318-7e6ef8ddb7ea',  // chip Intel close-up
  gpu:    '1714267853925-573c698e6a38',  // NVIDIA graphics card
  mb:     '1518770660439-4636190af475',  // motherboard PCB full view
  ram:    '1562976540-1502c2145186',     // DDR RAM sticks
  psu:    '1587202372775-e229f172b9d7',  // PC power supply / dark hardware
  case_:  '1726059668440-1e7f5b58b0ea',  // gaming PC case
  cooler: '1695728481082-ffb1e4b23e8e',  // CPU air cooler
  ssd:    '1597872200969-2b65d56bd16b',  // M.2 NVMe SSD
} as const;

const BASE = 'https://images.unsplash.com/photo-';

/** Tạo URL Unsplash với crop param để mỗi URL hiển thị vùng ảnh khác nhau */
function u(
  id: string,
  w: number = 1000,
  crop: 'center' | 'top' | 'bottom' | 'entropy' | 'left' | 'right' = 'center',
): string {
  return `${BASE}${id}?q=80&w=${w}&auto=format&fit=crop&crop=${crop}`;
}

// ─── Image pools per category ─────────────────────────────────────────────────
// Mỗi category có ≥ 6 URL khác nhau (crop khác nhau = vùng ảnh khác nhau).
// Sản phẩm thứ n trong category → pool[n % pool.length]

const POOLS: Record<string, string[]> = {
  // ── CPU ──────────────────────────────────────────────────────────────────
  // Dùng ảnh chip CPU + ảnh bo mạch (có socket CPU) để tạo đa dạng
  cpu: [
    u(ID.cpu,    1000, 'center'),   // toàn cảnh chip Intel
    u(ID.cpu,    1200, 'top'),      // vùng trên: logo + core
    u(ID.cpu,     900, 'bottom'),   // vùng dưới: chân tiếp điểm
    u(ID.cpu,    1100, 'entropy'),  // vùng nổi bật nhất theo entropy
    u(ID.mb,     1000, 'top'),      // socket CPU trên bo mạch
    u(ID.mb,      800, 'entropy'),  // zoom vào vùng socket
  ],

  // ── Mainboard ────────────────────────────────────────────────────────────
  mainboard: [
    u(ID.mb,     1000, 'center'),   // toàn bộ PCB
    u(ID.mb,     1200, 'top'),      // VRM / I/O panel
    u(ID.mb,      900, 'bottom'),   // PCIe slots / M.2 zone
    u(ID.mb,     1100, 'entropy'),  // vùng phức tạp nhất
  ],

  // ── RAM ──────────────────────────────────────────────────────────────────
  ram: [
    u(ID.ram,    1000, 'center'),   // toàn bộ thanh RAM
    u(ID.ram,    1200, 'top'),      // heatspreader + label
    u(ID.ram,     900, 'entropy'),  // cận vùng chip
    u(ID.ram,     800, 'bottom'),   // chân tiếp điểm
  ],

  // ── GPU ──────────────────────────────────────────────────────────────────
  gpu: [
    u(ID.gpu,    1000, 'center'),   // toàn bộ card đồ hoạ
    u(ID.gpu,    1200, 'top'),      // heatpipe + fan trên cùng
    u(ID.gpu,     900, 'bottom'),   // quạt / power connector
    u(ID.gpu,    1100, 'entropy'),  // vùng nổi bật nhất
  ],

  // ── PSU ──────────────────────────────────────────────────────────────────
  psu: [
    u(ID.psu,    1000, 'center'),   // toàn bộ nguồn
    u(ID.psu,    1200, 'top'),      // nhãn watt + quạt
    u(ID.psu,     900, 'entropy'),  // phần dây modular
  ],

  // ── Case ─────────────────────────────────────────────────────────────────
  case: [
    u(ID.case_,  1000, 'center'),   // nhìn thẳng
    u(ID.case_,  1200, 'top'),      // đỉnh case + quạt
    u(ID.case_,   900, 'entropy'),  // vùng kính / nội thất
  ],

  // ── Cooler ───────────────────────────────────────────────────────────────
  cooler: [
    u(ID.cooler, 1000, 'center'),   // tản nhiệt đầy đủ
    u(ID.cooler, 1200, 'top'),      // cánh tản / heatpipe
    u(ID.cooler,  900, 'entropy'),  // vùng quạt / finstack
  ],

  // ── SSD ──────────────────────────────────────────────────────────────────
  ssd: [
    u(ID.ssd,    1000, 'center'),   // M.2 SSD full
    u(ID.ssd,    1200, 'top'),      // nhãn / controller chip
  ],

  // ── Laptop ───────────────────────────────────────────────────────────────
  // Dùng ảnh hardware + PSU vì không có laptop photo trong seed
  laptop: [
    u(ID.gpu,    1000, 'center'),
    u(ID.psu,    1000, 'center'),
    u(ID.mb,     1000, 'center'),
    u(ID.cpu,    1000, 'center'),
  ],
};

/** Fallback nếu slug không có trong POOLS */
const FALLBACK_POOL = [u(ID.psu, 1000, 'center'), u(ID.mb, 1000, 'entropy')];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('❌  MONGODB_URI không tìm thấy trong .env!');
    process.exit(1);
  }

  console.log('🔌  Đang kết nối MongoDB Atlas...');
  await mongoose.connect(uri);
  console.log('✅  Kết nối thành công!\n');

  // 1. Build slug → _id map từ categories collection
  const categories = await CategoryModel.find({}).lean().exec();
  const slugById = new Map<string, string>(
    categories.map((c) => [String(c._id), (c.slug as string) ?? '']),
  );

  // 2. Fetch tất cả sản phẩm SEED-*
  const products = await ProductModel
    .find({ sku: { $regex: /^SEED-/ } })
    .lean()
    .exec();

  if (products.length === 0) {
    console.warn('⚠️  Không tìm thấy sản phẩm SEED-* nào.');
    console.warn('   Hãy chạy seed trước: pnpm run seed');
    await mongoose.disconnect();
    process.exit(0);
  }

  console.log(`🖼   Cập nhật ảnh cho ${products.length} sản phẩm...\n`);

  // 3. Round-robin index tracker per category
  const poolIdx: Record<string, number> = {};

  let updated   = 0;
  let skipped   = 0;

  for (const product of products) {
    const catId  = String(product.category);
    const slug   = slugById.get(catId) ?? 'other';
    const pool   = POOLS[slug] ?? FALLBACK_POOL;

    // Tăng index, wrap around với modulo để lặp vòng pool
    poolIdx[slug] = ((poolIdx[slug] ?? -1) + 1) % pool.length;
    const imageUrl = pool[poolIdx[slug]];

    const result = await ProductModel.updateOne(
      { _id: product._id },
      { $set: { images: [imageUrl] } },
    ).exec();

    if (result.modifiedCount > 0) {
      updated++;
      const idx   = poolIdx[slug];
      const name  = (product.name as string).padEnd(45).substring(0, 45);
      console.log(`  ✅  [${slug.padEnd(9)}] #${idx}  ${name}`);
      console.log(`        ${imageUrl}`);
    } else {
      skipped++;
      console.log(`  –   [${slug.padEnd(9)}]  ${product.name} (không đổi)`);
    }
  }

  console.log('\n─────────────────────────────────────────────────────────────');
  console.log(`📊  Hoàn tất: ${updated} cập nhật thành công, ${skipped} bỏ qua.`);
  console.log('\n💡  next.config.ts đã whitelist "images.unsplash.com" — không');
  console.log('    cần thay đổi thêm. Khởi động lại Next.js để thấy ảnh mới.\n');

  await mongoose.disconnect();
  console.log('🔌  Đã ngắt kết nối.');
}

main().catch((err) => {
  console.error('❌  Lỗi:', err.message ?? err);
  process.exit(1);
});
