import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { SellNftDto } from './dto/sellnft.dto';
import { BuyCancelNftDto } from './dto/buy-cancel.dto';

@Controller()
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) {}

  @Post('nft')
  create(@Body() data : CreateContractDto) {
    return this.contractsService.create(data);
  }

  @Post('sellnft')
  createSell(@Body() data : SellNftDto) {
    return this.contractsService.createSell(data)
  }


  // @Post('buynft')
  // findOne(@Body() data : SellNftDto) {
  //   return this.contractsService.findOne(data);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
    return this.contractsService.update(+id, updateContractDto);
  }

  @Delete('sellnft')
  remove(@Body() data : BuyCancelNftDto) {
    return this.contractsService.delete(data);
  }
}
