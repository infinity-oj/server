import { BuildinProgram, PresetProgram } from './interfaces';
import { MultiplyProgram } from './multiply';
import { PlusProgram } from './plus';
import { TestProgram } from './test';

export const builtins: Array<PresetProgram | BuildinProgram> = [
  new MultiplyProgram(),
  new PlusProgram(),
  new TestProgram(),
];
