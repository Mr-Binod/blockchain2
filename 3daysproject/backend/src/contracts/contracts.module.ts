import { Module } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { ContractsController } from './contracts.controller';
import { SmartAccInfoEntity } from 'src/account/entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NftUriEntity } from './entities/nft-uri.entity';
import { SellNftEntity } from './entities/sell-nft.entity';
import { UserNftEntity } from './entities/user-nft.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([SmartAccInfoEntity, NftUriEntity, SellNftEntity, UserNftEntity]) // ✅ required for repo injection
  ],
  controllers: [ContractsController],
  providers: [ContractsService],
})
export class ContractsModule {}
