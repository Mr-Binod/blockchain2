import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UseropsService } from './userops.service';
import { CreateUseropDto } from './dto/create-userop.dto';
import { UpdateUseropDto } from './dto/update-userop.dto';

@Controller('userops')
export class UseropsController {
  constructor(private readonly useropsService: UseropsService) {}

  @Post()
  create(@Body() createUseropDto: CreateUseropDto) {
    return this.useropsService.create(createUseropDto);
  }

  @Get()
  findAll() {
    return this.useropsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.useropsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUseropDto: UpdateUseropDto) {
    return this.useropsService.update(+id, updateUseropDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.useropsService.remove(+id);
  }
}
