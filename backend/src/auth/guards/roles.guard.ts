import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

// SUPERADMIN inherits all ADMIN permissions automatically
const ROLE_HIERARCHY: Record<string, string[]> = {
  SUPERADMIN: ['SUPERADMIN', 'ADMIN', 'CUSTOMER'],
  ADMIN:      ['ADMIN', 'CUSTOMER'],
  CUSTOMER:   ['CUSTOMER'],
};

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);
    if (!required) return true;
    const { user } = ctx.switchToHttp().getRequest();
    if (!user) return false;
    const allowed = ROLE_HIERARCHY[user.role] ?? [];
    return required.some((r) => allowed.includes(r));
  }
}
