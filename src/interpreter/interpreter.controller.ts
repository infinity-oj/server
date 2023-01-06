import { ProgramService } from '@/program/program.service';
import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import _ from 'lodash';
import { InterpreterService } from './interpreter.service';

@Controller('interpreter')
export class InterpreterController {
  constructor(
    private readonly programService: ProgramService,
    private readonly interpreterService: InterpreterService,
  ) {}

  @Post('run')
  async run(@Body() body: { program: string; inputs: Array<string | number> }) {
    const program = await this.programService.findOneByName(body.program);
    if (_.isEmpty(program)) {
      throw new NotFoundException();
    }
    const res = await this.interpreterService.run(program, body.inputs);
    console.log(res);
  }

  @Post('result')
  async result(@Body() body: { pid: string; outputs: Array<string | number> }) {
    const { pid, outputs } = body;
    const res = await this.interpreterService.finish(pid, outputs);
    console.log(res);
  }
}
