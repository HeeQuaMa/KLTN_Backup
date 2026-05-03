import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

/** Role values allowed to open Super Admin dashboard APIs (JWT `role` claim). */
const DASHBOARD_ALLOWED_ROLES = new Set([
  'Super Admin',
  'SUPER_ADMIN',
  'ADMIN',
]);

@Injectable()
export class AdminDashboardGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<{
      user?: { role?: string };
    }>();
    const role = req.user?.role != null ? String(req.user.role).trim() : '';
    if (!role || !DASHBOARD_ALLOWED_ROLES.has(role)) {
      throw new ForbiddenException(
        'Chỉ quản trị viên (Super Admin) mới được truy cập dashboard.',
      );
    }
    return true;
  }
}
