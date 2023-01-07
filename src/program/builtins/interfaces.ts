import { Program } from '../entities/program.entity';

export interface PresetProgram {
  program: Program;
}

export interface BuildinProgram extends PresetProgram {
  implementation: (...inputs: Array<string | number>) => Array<string | number>;
}
