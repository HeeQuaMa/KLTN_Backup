import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { User, UserSchema } from './schemas/user.schema';
import { AuthGuard, OptionalJwtAuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersRepository,
    AuthGuard,
    OptionalJwtAuthGuard,
  ],
  exports: [
    UsersService, 
    UsersRepository,
    AuthGuard,       
    OptionalJwtAuthGuard
  ],
})
export class UsersModule {}