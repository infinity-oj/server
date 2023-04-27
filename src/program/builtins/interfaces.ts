import { SlotValue } from '@/interpreter/slots';
import { Program } from '../entities/program.entity';

export interface PresetProgram {
  program: Program;
}

export interface BuildinProgram extends PresetProgram {
  implementation: (...inputs: Array<SlotValue>) => Array<SlotValue>;
}
