import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { response } from 'express';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
  ) {}

  @Post()
  async createAcc(@Body() data: CreateAccountDto) {
    console.log('connected')
    const result = await this.accountService.createAcc(data);
    return result
  }

  @Get()
  async getFindAll() {
    console.log('find')
    return await this.accountService.getFindAll();
    // console.log(data, ' find')
  }

  @Get(':user')
  async getFindOne(@Param('user') user : string){
    // console.log(await this.accountService.getFindOne(user))
    return await this.accountService.getFindOne(user)
  }
}
