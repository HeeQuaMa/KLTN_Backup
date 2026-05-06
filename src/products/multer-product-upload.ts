import { randomUUID } from 'crypto';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';
import { diskStorage } from 'multer';

const productsDir = join(process.cwd(), 'public', 'uploads', 'products');
if (!existsSync(productsDir)) {
  mkdirSync(productsDir, { recursive: true });
}

const imageMime = /^image\/(jpeg|jpg|pjpeg|png|gif|webp|avif)$/i;

export function productImagesMulterOptions() {
  return {
    storage: diskStorage({
      destination: (_req, _file, cb) => cb(null, productsDir),
      filename: (_req, file, cb) => {
        const m = /\.[a-z0-9]{1,8}$/i.exec(file.originalname ?? '');
        const ext = m?.[0] ?? '';
        cb(null, `${randomUUID()}${ext || '.jpg'}`);
      },
    }),
    limits: {
      fileSize: 5 * 1024 * 1024,
      files: 15,
    },
    fileFilter: (
      _req: unknown,
      file: Express.Multer.File,
      cb: (error: Error | null, acceptFile: boolean) => void,
    ) => {
      if (!imageMime.test(file.mimetype || '')) {
        cb(
          new Error(
            'Chỉ chấp nhận file ảnh (jpeg, png, gif, webp, avif)',
          ),
          false,
        );
        return;
      }
      cb(null, true);
    },
  };
}
