import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { configureUploads } from './configure-uploads';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.enableCors();
  configureUploads(app);
  const config = new DocumentBuilder()
    .setTitle('NetTech API')
    .setDescription('Tài liệu API cho dự án đồ án nhóm 19')
    .setVersion('1.0')
    .addBearerAuth() // Để Phát biết chỗ dán Token vào test
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document); // Đường dẫn sẽ là localhost:3001/api/docs
  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((err) => console.error(err));
