import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserOpsService } from './user-ops.service';
import { CreateUserOpDto } from './dto/create-user-op.dto';
import { UpdateUserOpDto } from './dto/update-user-op.dto';

@Controller('user-ops')
export class UserOpsController {
  constructor(private readonly userOpsService: UserOpsService) {}

  @Post()
  create(@Body() createUserOpDto: CreateUserOpDto) {
    return this.userOpsService.create(createUserOpDto);
  }

  @Get()
  findAll() {
    return this.userOpsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userOpsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserOpDto: UpdateUserOpDto) {
    return this.userOpsService.update(+id, updateUserOpDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userOpsService.remove(+id);
  }
}
