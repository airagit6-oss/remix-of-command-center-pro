import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as bodyParser from 'body-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // Enable CORS
  const allowedOrigins = [
    process.env.CORS_ORIGIN || 'http://localhost:3000',
    process.env.FRONTEND_URL || 'http://localhost:4173',
    'http://localhost:8080',
  ].filter(Boolean);

  app.enableCors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('CORS origin denied'));
      }
    },
    credentials: true,
  });

  // Stripe webhook raw body handling for signature verification
  app.use('/payments/webhook', bodyParser.raw({ type: 'application/json' }));

  // Global validation pipe
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Socket.IO adapter for realtime features
  app.useWebSocketAdapter(new IoAdapter(app));

  // Swagger/OpenAPI documentation
  const config = new DocumentBuilder()
    .setTitle('Software VALA Nexus API')
    .setDescription('Enterprise Backend API - PostgreSQL + NestJS + Redis + Socket.IO')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  logger.log(
    `Software VALA Nexus Backend running at http://localhost:${port}`,
  );
  logger.log(`API Documentation: http://localhost:${port}/api`);
  logger.log(`Environment: ${process.env.NODE_ENV}`);
}

bootstrap().catch((err) => {
  console.error('Application failed to start', err);
  process.exit(1);
});
