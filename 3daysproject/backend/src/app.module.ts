import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { ModelModule } from './model/model.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContractsModule } from './coin/contracts.module';
import { NftModule } from './nft/nft.module';
import { AccountModule } from './account/account.module';
import { UserOpsModule } from './user-ops/user-ops.module';


@Module({
  imports: [WalletModule, ModelModule,
    SequelizeModule.forRoot({
      dialect: 'mysql', // or 'postgres', etc.
      host: 'localhost',
      port: 3306,
      username: 'master',
      password: 'admin123',
      database: 'B3project',
      autoLoadModels: true,
      synchronize: true,
      sync: { force: false },
    }),
    ContractsModule,
    NftModule,
    AccountModule,
    UserOpsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
