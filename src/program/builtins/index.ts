import { BuildinProgram, PresetProgram } from './interfaces';
import { MultiplyProgram } from './multiply';
import { PlusProgram } from './plus';

export const builtins: Array<PresetProgram | BuildinProgram> = [
  new MultiplyProgram(),
  new PlusProgram(),
];
