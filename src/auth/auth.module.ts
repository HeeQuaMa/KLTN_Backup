import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // PHẢI CÓ
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule, // PHẢI IMPORT VÀO ĐÂY
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        // Lấy từ file .env
        secret: configService.get<string>('JWT_SECRET'), 
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}