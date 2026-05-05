import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module'; // Kéo UsersModule vào để dùng db

@Module({
  imports: [
    UsersModule, 
    // Cấu hình JWT: thẻ này có hiệu lực 1 ngày (Giống y hệt code cũ của bạn)
    JwtModule.register({
      global: true,
      secret: 'secret_key', // nên để vào .env
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}