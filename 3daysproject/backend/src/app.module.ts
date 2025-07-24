import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { ModelModule } from './model/model.module';
// import { SequelizeModule } from '@nestjs/sequelize';
import { AccountModule } from './account/account.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SmartAccInfo } from './account/entities/account.entity';
import { BundlerModule } from './bundler/bundler.module';
import { UseropsModule } from './userops/userops.module';


@Module({
  // imports: [WalletModule, ModelModule,
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // makes ConfigService available app-wide
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'myid',
      password: '1994!BDs',
      database: 'B3project',
      entities: [SmartAccInfo], // ⬅️ Register multiple entities
      synchronize: false,
      // dropSchema: true 
    }),
    // SequelizeModule.forRoot({
    //   dialect: 'mysql', // or 'postgres', etc.
    //   host: 'localhost',
    //   port: 3306,
    //   username: 'myid',
    //   password: '1994!BDs',
    //   database: 'B3project',
    //   autoLoadModels: true,
    //   synchronize: true,
    //   sync: { force: false },
    // }),
    TypeOrmModule.forFeature([SmartAccInfo]),
    AccountModule,
    TypeOrmModule,
    BundlerModule,
    UseropsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
