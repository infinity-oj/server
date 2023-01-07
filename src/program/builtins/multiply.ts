import { Program } from '../entities/program.entity';
import { BuildinProgram } from './interfaces';

const program = new Program();

program.name = 'multiply';

program.inputs = {
  slots: [
    { name: 'oprand 1', type: 'number' },
    { name: 'oprand 2', type: 'number' },
  ],
};
program.outputs = {
  slots: [{ name: 'result', type: 'number' }],
};

program.programs = [];

program.links = [];

export class MultiplyProgram implements BuildinProgram {
  implementation: (...inputs: (string | number)[]) => (string | number)[] = (
    ...inputs: (string | number)[]
  ) => {
    let res = 1;
    for (const v of inputs) {
      res *= +v;
    }
    return [res];
  };
  program: Program = program;
}
