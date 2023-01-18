import { SlotType, SlotValue } from '@/interpreter/interpreter.service';
import { Program } from '../entities/program.entity';
import { BuildinProgram } from './interfaces';

const program = new Program();

program.name = 'plus';

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

export class PlusProgram implements BuildinProgram {
  implementation: (...inputs: SlotValue[]) => SlotValue[] = (
    ...inputs: SlotValue[]
  ) => {
    let res = 0;
    for (const v of inputs) {
      if (v.type !== SlotType.NUMBER) {
        throw new Error('Program Plus requires type number');
      }
      res += v.value;
    }
    return [
      {
        type: SlotType.NUMBER,
        value: res,
      },
    ];
  };
  program: Program = program;
}
