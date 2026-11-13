import { type AuthUserDto } from '@bidnest/shared';
import { Body, Controller, Get, HttpCode, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import type { CookieOptions, Request, Response } from 'express';
import type { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ACCESS_COOKIE, ACCESS_TTL_SECONDS, REFRESH_COOKIE, AuthService } from './auth.service';
import { CurrentUser, type AuthPrincipal } from './decorators/current-user.decorator';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

const baseCookie: CookieOptions = {
  httpOnly: true,
  // Same-site across ports; first-party behind the Next proxy.
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
};

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UsersService,
  ) {}

  @Post('register')
  @HttpCode(201)
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response): Promise<AuthUserDto> {
    const session = await this.auth.register(dto.name, dto.email, dto.password);
    await this.startSession(res, session.user);
    return session.dto;
  }

  @Post('login')
  @HttpCode(200)
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response): Promise<AuthUserDto> {
    const session = await this.auth.login(dto.email, dto.password);
    await this.startSession(res, session.user);
    return session.dto;
  }

  // Called by the frontend when a request hits 401.
  @Post('refresh')
  @HttpCode(200)
  @ApiCookieAuth('refresh_token')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<AuthUserDto> {
    const presented = req.cookies?.[REFRESH_COOKIE];
    if (!presented) {
      throw new UnauthorizedException({ code: 'NO_SESSION', message: 'Sign in to continue' });
    }
    const { user, access, refresh, refreshExpiresAt } = await this.auth.rotateRefreshToken(presented);
    this.setCookies(res, access, refresh, refreshExpiresAt);
    return this.users.toAuthDto(user);
  }

  @Post('logout')
  @HttpCode(204)
  @ApiCookieAuth('access_token')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response): Promise<void> {
    const principal = (req as Request & { auth?: AuthPrincipal }).auth;
    await this.auth.logout(req.cookies?.[REFRESH_COOKIE], principal?.user.id);
    this.clearCookies(res);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiCookieAuth('access_token')
  async me(@CurrentUser() principal: AuthPrincipal): Promise<AuthUserDto> {
    return this.users.toAuthDto(principal.user);
  }

  private async startSession(res: Response, user: User): Promise<void> {
    const { access, refresh, refreshExpiresAt } = await this.auth.createSession(user);
    this.setCookies(res, access, refresh, refreshExpiresAt);
  }

  private setCookies(res: Response, access: string, refresh: string, refreshExpiresAt: Date): void {
    res.cookie(ACCESS_COOKIE, access, { ...baseCookie, path: '/', maxAge: ACCESS_TTL_SECONDS * 1000 });
    // Scoped to the auth path: smaller blast radius if leaked.
    res.cookie(REFRESH_COOKIE, refresh, { ...baseCookie, path: '/api/v1/auth', expires: refreshExpiresAt });
  }

  private clearCookies(res: Response): void {
    res.clearCookie(ACCESS_COOKIE, { ...baseCookie, path: '/' });
    res.clearCookie(REFRESH_COOKIE, { ...baseCookie, path: '/api/v1/auth' });
  }
}
