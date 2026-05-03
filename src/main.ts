import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
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
