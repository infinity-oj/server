import { Program } from '../entities/program.entity';

const CompileProgram = new Program();

CompileProgram.name = 'compile';
CompileProgram.inputs = {
  slots: [{ name: 'source code', type: 'file' }],
};
CompileProgram.outputs = {
  slots: [{ name: 'elf', type: 'file' }],
};
