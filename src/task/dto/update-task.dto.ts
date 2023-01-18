import { SlotValue } from '@/interpreter/interpreter.service';
import { IsArray } from 'class-validator';

export class UpdateTaskDto {
  @IsArray()
  outputs: Array<SlotValue>;
}
