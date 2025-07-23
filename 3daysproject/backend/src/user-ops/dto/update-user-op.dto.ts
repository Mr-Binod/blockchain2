import { PartialType } from '@nestjs/mapped-types';
import { CreateUserOpDto } from './create-user-op.dto';

export class UpdateUserOpDto extends PartialType(CreateUserOpDto) {}
