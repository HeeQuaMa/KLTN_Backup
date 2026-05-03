import type { INestApplication } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { existsSync, mkdirSync } from 'fs';
import { join } from 'path';

/** Serve `/uploads/...` from `public/uploads` (product images). */
export function configureUploads(app: INestApplication): void {
  const nest = app as NestExpressApplication;
  const uploadsRoot = join(process.cwd(), 'public', 'uploads');
  const productsDir = join(uploadsRoot, 'products');
  if (!existsSync(productsDir)) {
    mkdirSync(productsDir, { recursive: true });
  }
  nest.useStaticAssets(uploadsRoot, { prefix: '/uploads/' });
}
