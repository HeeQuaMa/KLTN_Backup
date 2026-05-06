import {
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const ADMIN_TABS = ['all', 'pending', 'processing', 'completed'] as const;
const ADMIN_CHANNELS = ['all', 'ONLINE', 'O2O'] as const;
const ADMIN_DATES = ['all', 'today', 'week', 'month'] as const;

export class AdminOrdersQueryDto {
  @IsOptional()
  @IsString()
  @IsIn(ADMIN_TABS)
  tab?: (typeof ADMIN_TABS)[number];

  @IsOptional()
  @IsString()
  @IsIn(ADMIN_CHANNELS)
  channel?: (typeof ADMIN_CHANNELS)[number];

  /** Tìm theo mã đơn hoặc SĐT / email khách */
  @IsOptional()
  @IsString()
  @MaxLength(200)
  q?: string;

  @IsOptional()
  @IsString()
  @IsIn(ADMIN_DATES)
  date?: (typeof ADMIN_DATES)[number];
}

const UPDATE_STATUSES = [
  'PENDING_CONFIRMATION',
  'PACKING',
  'SHIPPING',
  'COMPLETED',
  'CANCELLED',
  'PENDING',
] as const;

export class UpdateOrderStatusDto {
  @IsString()
  @IsIn(UPDATE_STATUSES)
  status: (typeof UPDATE_STATUSES)[number];
}
