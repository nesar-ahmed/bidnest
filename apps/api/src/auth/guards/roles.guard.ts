import { UserRole } from '@bidnest/shared';
import { ForbiddenException, Injectable, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { ROLES_KEY } from '../decorators/roles.decorator';
import type { AuthPrincipal } from '../decorators/current-user.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const { auth } = context.switchToHttp().getRequest<Request & { auth: AuthPrincipal }>();
    if (!auth || !required.includes(auth.user.role)) {
      throw new ForbiddenException({ code: 'FORBIDDEN_ROLE', message: 'Your role does not allow this action' });
    }
    return true;
  }
}
