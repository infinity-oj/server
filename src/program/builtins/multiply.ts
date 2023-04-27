import { SlotType, SlotValue } from '@/interpreter/slots';
import { Program } from '../entities/program.entity';
import { BuildinProgram } from './interfaces';

const program = new Program();

program.name = 'multiply';

program.inputs = {
  slots: [
    { name: 'oprand 1', type: SlotType.NUMBER },
    { name: 'oprand 2', type: SlotType.NUMBER },
  ],
};
program.outputs = {
  slots: [{ name: 'result', type: SlotType.NUMBER }],
};

program.programs = [];

program.links = [];

export class MultiplyProgram implements BuildinProgram {
  implementation: (...inputs: SlotValue[]) => SlotValue[] = (
    ...inputs: SlotValue[]
  ) => {
    let res = 1;
    for (const v of inputs) {
      if (v.type !== SlotType.NUMBER) {
        throw new Error('Program Plus requires type number');
      }
      res *= v.value;
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
