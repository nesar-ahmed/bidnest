import { createParamDecorator, type ExecutionContext } from '@nestjs/common';
import type { User } from '../../users/entities/user.entity';

/** Set by JwtAuthGuard on every request that passes it. */
export interface AuthPrincipal {
  user: User;
}

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): AuthPrincipal =>
    ctx.switchToHttp().getRequest<{ auth: AuthPrincipal }>().auth,
);
