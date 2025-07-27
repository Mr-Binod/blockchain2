// app.module.ts
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ModelService } from './model.service';
import { ModelController } from './model.controller';
import { User } from './table/user.model';


@Module({
    imports: [SequelizeModule.forFeature([User])],
    providers: [ModelService],
    controllers: [ModelController]
})
export class ModelModule { }