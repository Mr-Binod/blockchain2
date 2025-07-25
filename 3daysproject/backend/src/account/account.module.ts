import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartAccInfoEntity } from './entities/account.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmartAccInfoEntity]) // ✅ required for repo injection
  ],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
