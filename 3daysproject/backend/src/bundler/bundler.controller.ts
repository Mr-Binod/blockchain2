import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { BundlerService } from './bundler.service';
import { CreateBundlerDto } from './dto/create-bundler.dto';
import { UpdateBundlerDto } from './dto/update-bundler.dto';

@Controller()
export class BundlerController {
  constructor(private readonly bundlerService: BundlerService) {}

  @Post('userop')
  async addMempool(@Body() data: CreateBundlerDto) {
    try {
      console.log('connected' ,data)
      await this.bundlerService.addMempool(data);
      return this.bundlerService.getMempool()
    } catch (error) {
      return error
    }
  }

  // @Post('createnft')
  // async CreateNft(@Body() Uri : string, address : string) {
  //   try {
      
  //     return this.CreateNft(Uri, address)
  //   } catch (error) {
  //     return {state : 403, message : error}
  //   }
  // }
  

  @Get('userop')
  getMempool() {
    return this.bundlerService.getMempool();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.bundlerService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateBundlerDto: UpdateBundlerDto) {
  //   return this.bundlerService.update(+id, updateBundlerDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.bundlerService.remove(+id);
  // }
}
