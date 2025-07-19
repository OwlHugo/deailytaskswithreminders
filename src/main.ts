import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionInterceptor } from './common/interceptors/http-exception.interceptor';

// Polyfill para crypto em ambientes que não suportam
if (typeof globalThis.crypto === 'undefined') {
  const { webcrypto } = require('crypto');
  globalThis.crypto = webcrypto;
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalInterceptors(new HttpExceptionInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Task Scheduler API')
    .setDescription('API para gerenciamento de tarefas')
    .setVersion('1.0')
    .addTag('tasks', 'Operações relacionadas a tarefas')
    .addTag('webhooks', 'Operações relacionadas a webhooks')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();