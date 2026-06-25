import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './common/http-exception/http-exception.filter';
import { TransformResponseInterceptor } from './common/transform-response/transform-response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformResponseInterceptor());

  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('پروژه آموزشی NestJS')
    .setVersion('1.0')
    .addTag('tasks')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  console.log('🚀 Server running on: http://localhost:3000');
  console.log('📚 Swagger: http://localhost:3000/api');
}
bootstrap();
