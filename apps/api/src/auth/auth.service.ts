import { type AuthUserDto } from '@bidnest/shared';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcryptjs';
import { randomBytes, createHash } from 'node:crypto';
import { IsNull, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { RefreshToken } from './entities/refresh-token.entity';

export const ACCESS_COOKIE = 'access_token';
export const REFRESH_COOKIE = 'refresh_token';
export const ACCESS_TTL_SECONDS = 15 * 60;
const REFRESH_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export interface AccessTokenPayload {
  sub: string;
  role: string;
}

export interface AuthSession {
  user: User;
  dto: AuthUserDto;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    @InjectRepository(RefreshToken) private readonly refreshTokens: Repository<RefreshToken>,
  ) {}

  async register(name: string, email: string, password: string): Promise<AuthSession> {
    if (await this.users.findByEmail(email)) {
      throw new ForbiddenException({ code: 'EMAIL_TAKEN', message: 'An account with this email already exists' });
    }
    // TODO(notifications): send a verification email once the mailer module exists.
    const user = await this.users.create({
      name,
      email,
      passwordHash: await hash(password, 10),
      verified: true,
    });
    return { user, dto: await this.users.toAuthDto(user) };
  }

  async login(email: string, password: string): Promise<AuthSession> {
    const user = await this.users.findByEmail(email);
    // Same error whether the email or the password was wrong.
    if (!user || !(await compare(password, user.passwordHash))) {
      throw new UnauthorizedException({ code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' });
    }
    await this.users.assertUsable(user);
    return { user, dto: await this.users.toAuthDto(user) };
  }

  async createSession(user: User): Promise<{ access: string; refresh: string; refreshExpiresAt: Date }> {
    const access = this.jwt.sign<AccessTokenPayload>(
      { sub: user.id, role: user.role },
      { expiresIn: ACCESS_TTL_SECONDS },
    );
    const refresh = randomBytes(48).toString('hex');
    const refreshExpiresAt = new Date(Date.now() + REFRESH_TTL_MS);
    await this.refreshTokens.save(
      this.refreshTokens.create({ userId: user.id, tokenHash: this.hashToken(refresh), expiresAt: refreshExpiresAt }),
    );
    return { access, refresh, refreshExpiresAt };
  }

  // Reusing a revoked token kills the whole session family (stolen-cookie protection).
  async rotateRefreshToken(
    presented: string,
  ): Promise<{ user: User; access: string; refresh: string; refreshExpiresAt: Date }> {
    const stored = await this.refreshTokens.findOneBy({ tokenHash: this.hashToken(presented) });
    if (!stored || stored.expiresAt.getTime() < Date.now()) {
      throw new UnauthorizedException({ code: 'INVALID_REFRESH', message: 'Session expired, please sign in again' });
    }
    if (stored.revokedAt) {
      await this.revokeAllSessions(stored.userId);
      throw new UnauthorizedException({ code: 'REFRESH_REUSED', message: 'Session revoked, please sign in again' });
    }

    const user = await this.users.findById(stored.userId);
    await this.users.assertUsable(user);

    stored.revokedAt = new Date();
    await this.refreshTokens.save(stored);
    const session = await this.createSession(user);
    return { user, ...session };
  }

  async logout(presented: string | undefined, userId: string | undefined): Promise<void> {
    if (presented) {
      const stored = await this.refreshTokens.findOneBy({ tokenHash: this.hashToken(presented) });
      if (stored && !stored.revokedAt) {
        stored.revokedAt = new Date();
        await this.refreshTokens.save(stored);
      }
    }
    if (userId) {
      await this.revokeAllSessions(userId);
    }
  }

  private async revokeAllSessions(userId: string): Promise<void> {
    await this.refreshTokens.update({ userId, revokedAt: IsNull() }, { revokedAt: new Date() });
  }

  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }
}
