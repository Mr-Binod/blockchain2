import { PartialType } from '@nestjs/mapped-types';
import { CreateBundlerDto } from './create-bundler.dto';

export class UpdateBundlerDto extends PartialType(CreateBundlerDto) {}
