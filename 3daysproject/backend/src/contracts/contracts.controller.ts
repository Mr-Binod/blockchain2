import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { SellNftDto } from './dto/sellnft.dto';
import { BuyCancelNftDto } from './dto/buy-cancel.dto';
import { NftUriDto } from './dto/nft-uri.dto';
import { createNftUriDto } from './dto/createnft.dto';
import { BuynftDto } from './dto/Buynft.dto';

@Controller()
export class ContractsController {
  constructor(private readonly contractsService: ContractsService) { }

  @Post('nft')
  create(@Body() data: CreateContractDto) {
    return this.contractsService.create(data);
  }

  @Post('sellnft')
  createSell(@Body() data: SellNftDto) {
    return this.contractsService.createSell(data)
  }
  @Post('contractsellnft')
  ContractCreateSell(@Body() data: SellNftDto) {
    return this.contractsService.ContractCreateSell(data)
  }

  @Post('createnft')
  CreateNFT(@Body() data: createNftUriDto) {
    console.log('GG1', data)
    return this.contractsService.CreateNFT(data)
  }

  @Post('createnftdb')
  async CreateNftdb(@Body() data: NftUriDto) {
    return this.contractsService.CreateNftdb(data)
  }

  @Post('createusernft')
  async createUserNft(@Body() data: CreateContractDto) {
    console.log('connected1')
    return this.contractsService.createUserNft(data)
  }

  @Post('buynft')
  PostBuyNft(@Body() data: BuynftDto) {
    console.log(data, 'buynft')
    return this.contractsService.UpdateNft(data)
  }
  @Post('contractbuynft')
  ContractBuyNft(@Body() data: BuynftDto) {
    console.log(data, 'buynft22')
    return this.contractsService.ContractBuyNft(data)
  }


  // @Post('buynft')
  // findOne(@Body() data : SellNftDto) {
  //   return this.contractsService.findOne(data);
  // }

  @Get('user/:user')
  getUserNft(@Param('user') user: string) {
    return this.contractsService.getUserNfts(user)
  }

  @Get('sellnft')
  getSellNft() {
    return this.contractsService.getSellNft()
  }

  @Get('sellnft/:userid/:nftid')
  findOneSellitem(
    @Param('userid') userid: string,
    @Param('nftid') nftid: number) {
    return this.contractsService.findOneSellitem(userid, nftid)
  }

  @Patch('sellnft')
  CancelSellNft(@Body() data: CreateContractDto) {
    console.log(data, 'patchdd')
    return this.contractsService.CancelSellNft(data)
  }

  @Delete('sellnft')
  delete(@Body() data: BuyCancelNftDto) {
    // console.log('delete', data)
    return this.contractsService.delete(data);
  }

  @Delete('contractsellnft')
  CancelContractNft(@Body() data: BuyCancelNftDto) {
    return this.contractsService.CancelContractNft(data)
  }



}
