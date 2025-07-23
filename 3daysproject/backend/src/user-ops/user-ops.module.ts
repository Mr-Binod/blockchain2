import { Module } from '@nestjs/common';
import { UserOpsService } from './user-ops.service';
import { UserOpsController } from './user-ops.controller';

@Module({
  controllers: [UserOpsController],
  providers: [UserOpsService],
})
export class UserOpsModule {}
