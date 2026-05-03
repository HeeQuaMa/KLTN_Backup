import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { BranchesRepository } from './branches.repository';
import { BranchSchema } from './schemas/branch.schema';

@Module({
  imports: [
    // Khai báo Model Branch vào Module cho Mongoose xài
    MongooseModule.forFeature([{ name: 'Branch', schema: BranchSchema }]),
  ],
  controllers: [BranchesController],
  providers: [
    BranchesService,
    BranchesRepository, // Nhớ thêm Repository vào providers để Service dùng được
  ],
  exports: [BranchesService], // Export nếu sau này Module khác cần lấy thông tin chi nhánh
})
export class BranchesModule {}
