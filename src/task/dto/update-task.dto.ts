import { SlotValue } from '@/interpreter/slots';
import { IsArray } from 'class-validator';

export class UpdateTaskDto {
  @IsArray()
  outputs: Array<SlotValue>;
}
