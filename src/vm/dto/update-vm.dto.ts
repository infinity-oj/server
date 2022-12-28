import { PartialType } from '@nestjs/swagger';
import { CreateVmDto } from './create-vm.dto';

export class UpdateVmDto extends PartialType(CreateVmDto) {}
