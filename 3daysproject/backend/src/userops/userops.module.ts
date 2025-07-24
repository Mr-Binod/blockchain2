import { Module } from '@nestjs/common';
import { UseropsService } from './userops.service';
import { UseropsController } from './userops.controller';

@Module({
  controllers: [UseropsController],
  providers: [UseropsService],
})
export class UseropsModule {}
