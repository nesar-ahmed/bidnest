import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { swaggerAuthCss, swaggerAuthScript } from './swagger-auth';

// DTO schemas are generated at build time by the @nestjs/swagger CLI plugin (nest-cli.json).
export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Bidnest API')
    .setDescription(
      'Auction marketplace API. Session endpoints use httpOnly cookies ' +
        '(access_token / refresh_token): call POST /api/v1/auth/login first and ' +
        'the docs UI reuses those cookies.',
    )
    .setVersion('1.0')
    .addCookieAuth('access_token', { type: 'apiKey', in: 'cookie' }, 'access_token')
    .addCookieAuth('refresh_token', { type: 'apiKey', in: 'cookie' }, 'refresh_token')
    .addTag('auth', 'Registration, login, session rotation')
    .addTag('users', 'Signed-in user profile and seller application')
    .addTag('admin', 'Moderation and admin operations')
    .addTag('health', 'Liveness probe')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/docs/json',
    customSiteTitle: 'Bidnest API docs',
    customCss: swaggerAuthCss,
    customJsStr: swaggerAuthScript,
    swaggerOptions: { withCredentials: true, displayRequestDuration: true },
  });
}
