import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';

@Controller('account')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
  ) {}

  @Post()
  async createAcc(@Body() data: CreateAccountDto) {
    console.log('connected')
    // if(await this.modelService.getUser(data.id)) return('id not available')
    return this.accountService.createAcc(data);
  }

  @Get()
  getAcc() {
    return this.accountService.getAcc();
  }

}
