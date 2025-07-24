import { PartialType } from '@nestjs/mapped-types';
import { CreateUseropDto } from './create-userop.dto';

export class UpdateUseropDto extends PartialType(CreateUseropDto) {}
