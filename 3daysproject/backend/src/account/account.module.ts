import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { SmartAccInfo } from './entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmartAccInfo]) // ✅ required for repo injection
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
