import { Global, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';

@Global()
@Module({
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([RefreshToken]),
    ConfigModule,
    JwtModule.registerAsync({
      // Global so guards instantiated in other module contexts can inject JwtService.
      global: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const devSecret = 'dev-insecure-secret-change-me';
        const secret = config.get<string>('JWT_SECRET');
        if (process.env.NODE_ENV === 'production' && (!secret || secret === devSecret)) {
          throw new Error('JWT_SECRET must be set to a strong value in production');
        }
        return { secret: secret ?? devSecret };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard],
  exports: [AuthService, JwtAuthGuard, RolesGuard],
})
export class AuthModule {}
