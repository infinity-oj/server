import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ForbiddenException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JudgementService } from './judgement.service';
import {
  CreateJudgementDto,
  CreateTraditionalJudgementDto,
} from './dto/create-judgement.dto';
import { UpdateJudgementDto } from './dto/update-judgement.dto';
import { ClientService } from '@/client/client.service';
import { ProgramService } from '@/program/program.service';
import _ from 'lodash';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SlotValue } from '@/interpreter/slots';

@Controller('judgement')
export class JudgementController {
  constructor(
    private readonly judgementService: JudgementService,
    private readonly clientService: ClientService,
    private readonly programService: ProgramService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Post()
  async create(@Body() dto: CreateJudgementDto) {
    const client = await this.clientService.findOneByToken(dto.clientToken);
    if (_.isNull(client)) {
      throw new ForbiddenException();
    }

    const program = await this.programService.findOneByName(dto.program);
    if (_.isNull(program)) {
      throw new BadRequestException('unknown program');
    }

    const judgement = await this.judgementService.create(
      client,
      program,
      dto.inputs,
    );
    const res = (await this.eventEmitter.emitAsync('judgement.created', {
      judgement,
    })) as Array<
      | {
          pid: string;
        }
      | { result: Array<SlotValue> }
    >;

    if (res.length !== 1) {
      throw new InternalServerErrorException();
    }

    if ('result' in res[0]) {
      judgement.outputs = res[0].result;
    }

    return judgement;
  }

  @Post('/traditional')
  async createTraditionalJudgement(@Body() dto: CreateTraditionalJudgementDto) {
    const client = await this.clientService.findOneByToken(dto.clientToken);
    if (!client) {
      throw new ForbiddenException();
    }
    return await this.judgementService.createJudgement(client);
  }

  @Get()
  findAll() {
    return this.judgementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.judgementService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJudgementDto: UpdateJudgementDto,
  ) {
    return this.judgementService.update(+id, updateJudgementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.judgementService.remove(+id);
  }
}
