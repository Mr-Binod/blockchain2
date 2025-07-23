import { Injectable } from '@nestjs/common';
import { CreateUserOpDto } from './dto/create-user-op.dto';
import { UpdateUserOpDto } from './dto/update-user-op.dto';

@Injectable()
export class UserOpsService {
  create(createUserOpDto: CreateUserOpDto) {
    return 'This action adds a new userOp';
  }

  findAll() {
    return `This action returns all userOps`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userOp`;
  }

  update(id: number, updateUserOpDto: UpdateUserOpDto) {
    return `This action updates a #${id} userOp`;
  }

  remove(id: number) {
    return `This action removes a #${id} userOp`;
  }
}
