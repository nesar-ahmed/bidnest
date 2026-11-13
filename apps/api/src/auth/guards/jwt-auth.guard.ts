import { Injectable, UnauthorizedException, type CanActivate, type ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Request } from 'express';
import { UsersService } from '../../users/users.service';
import { ACCESS_COOKIE, type AccessTokenPayload } from '../auth.service';
import type { AuthPrincipal } from '../decorators/current-user.decorator';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request & { auth?: AuthPrincipal }>();
    const token = request.cookies?.[ACCESS_COOKIE];
    if (!token) {
      throw new UnauthorizedException({ code: 'NO_SESSION', message: 'Sign in to continue' });
    }

    let payload: AccessTokenPayload;
    try {
      payload = await this.jwt.verifyAsync<AccessTokenPayload>(token);
    } catch {
      throw new UnauthorizedException({ code: 'SESSION_EXPIRED', message: 'Session expired, sign in again' });
    }

    const user = await this.users.findById(payload.sub).catch(() => null);
    if (!user) {
      throw new UnauthorizedException({ code: 'NO_SESSION', message: 'Sign in to continue' });
    }
    await this.users.assertUsable(user);

    request.auth = { user };
    return true;
  }
}
