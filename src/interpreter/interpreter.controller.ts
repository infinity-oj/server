import { ProgramService } from '@/program/program.service';
import { Body, Controller, NotFoundException, Post } from '@nestjs/common';
import _ from 'lodash';
import { InterpreterService, SlotValue } from './interpreter.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('interpreter')
export class InterpreterController {
  constructor(
    private readonly programService: ProgramService,
    private readonly interpreterService: InterpreterService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post('run')
  async run(@Body() body: { program: string; inputs: Array<SlotValue> }) {
    const program = await this.programService.findOneByName(body.program);
    if (_.isEmpty(program)) {
      throw new NotFoundException();
    }
    console.log(body.inputs);
    const res = await this.interpreterService.run(program, body.inputs);
    console.log(res);
  }

  @Post('result')
  async result(@Body() body: { pid: string; outputs: Array<SlotValue> }) {
    const { pid, outputs } = body;
    const judgement = await this.interpreterService.getJudgementNameByPid(pid);
    if (_.isEmpty(judgement)) {
      throw new NotFoundException();
    }

    const res = await this.interpreterService.finish(pid, outputs);
    console.log(res);
    await this.interpreterService.emitProgramFinished(judgement, outputs);
  }
}
