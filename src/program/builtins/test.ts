import { SlotType, SlotValue } from '@/interpreter/slots';
import { Program } from '../entities/program.entity';
import { BuildinProgram } from './interfaces';

const program = new Program();

program.name = 'test';

program.inputs = {
  slots: [{ name: 'oprand 1', type: SlotType.NUMBER }],
};
program.outputs = {
  slots: [{ name: 'result', type: SlotType.NUMBER }],
};

program.programs = [];

program.links = [];

export class TestProgram implements BuildinProgram {
  implementation: (...inputs: SlotValue[]) => SlotValue[] = (
    ...inputs: SlotValue[]
  ) => {
    let res = 0;
    return inputs;
  };
  program: Program = program;
}
