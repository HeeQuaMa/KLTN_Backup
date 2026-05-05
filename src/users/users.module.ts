import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    // Đã xóa JwtModule ở đây để dời nhà sang AuthModule
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository],
  // QUAN TRỌNG: Phải export UsersRepository ra thì AuthModule mới gọi tới DB được
  exports: [UsersService, UsersRepository], 
})
export class UsersModule {}