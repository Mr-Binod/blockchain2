import { Injectable } from '@nestjs/common';
import { CreateUseropDto } from './dto/create-userop.dto';
import { UpdateUseropDto } from './dto/update-userop.dto';

@Injectable()
export class UseropsService {
  create(createUseropDto: CreateUseropDto) {
    return 'This action adds a new userop';
  }

  findAll() {
    return `This action returns all userops`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userop`;
  }

  update(id: number, updateUseropDto: UpdateUseropDto) {
    return `This action updates a #${id} userop`;
  }

  remove(id: number) {
    return `This action removes a #${id} userop`;
  }
}
