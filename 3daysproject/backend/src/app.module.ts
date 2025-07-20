import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { ModelModule } from './model/model.module';
import { SequelizeModule } from '@nestjs/sequelize';

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
      sync: { force: false  },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
