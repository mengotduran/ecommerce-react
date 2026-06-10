import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins: (string | RegExp)[] = [
    'http://localhost:3000',
    process.env.FRONTEND_URL?.trim().replace(/\/$/, ''),
  ].filter((o): o is string => Boolean(o));
  if (process.env.NODE_ENV !== 'production') {
    // Allow phones/devices on the local network during dev testing
    // (192.168.x / 10.x = home LANs, 172.16-31.x = iPhone hotspot etc.)
    allowedOrigins.push(/^http:\/\/(localhost|192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3}):\d+$/);
  }
  app.enableCors({ origin: allowedOrigins, credentials: true });
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}
bootstrap();
