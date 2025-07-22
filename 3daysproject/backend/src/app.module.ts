import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { ModelModule } from './model/model.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ContractsModule } from './coin/contracts.module';
import { NftModule } from './nft/nft.module';
import { AccountModule } from './account/account.module';


@Module({
  imports: [WalletModule, ModelModule,
    SequelizeModule.forRoot({
      dialect: 'mysql', // or 'postgres', etc.
      host: 'localhost',
      port: 3306,
      username: 'myid',
      password: '1994!BDs',
      database: 'B3project',
      autoLoadModels: true,
      synchronize: true,
      sync: { force: false },
    }),
    ContractsModule,
    NftModule,
    AccountModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
