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
  OnModuleInit,
} from '@nestjs/common';
import { JudgementService } from './judgement.service';
import {
  CreateJudgementDto,
  CreateTraditionalJudgementDto,
} from './dto/create-judgement.dto';
import { UpdateJudgementDto } from './dto/update-judgement.dto';
import { ClientService } from '@/client/client.service';
import { ProgramService } from '@/program/program.service';
import _, { identity } from 'lodash';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { SlotValue, slotValueSchema } from '@/interpreter/slots';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import z from 'zod';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom, lastValueFrom, map } from 'rxjs';

@Controller('judgement')
export class JudgementController implements OnModuleInit {
  constructor(
    @InjectRedis('sub') private readonly redis: Redis,
    private readonly judgementService: JudgementService,
    private readonly clientService: ClientService,
    private readonly programService: ProgramService,
    private readonly httpService: HttpService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  onModuleInit() {
    const  deal = async ([id, fields]: [id: string, fields: string[]]) => {
      // console.log(id), console.log(_.fromPairs(_.chunk(fields, 2)));
      const data = _.fromPairs(
        _.chunk(fields, 2).map(([k, v]) =>
          k === 'inputs' ? [k, JSON.parse(v)] : [k, v],
        ),
      );

      const argsSchema = z.object({
        clientToken: z.string(),
        program: z.string(),
        inputs: z.array(slotValueSchema),
      });

      const args = argsSchema.parse(data);
      if (args.program === 'syzoj-judger') {
        return;
      }
      const url = `${process.env.IOJ_HOST}/judgement`;
      await lastValueFrom(
        this.httpService
          .post<{ name: string }>(url, {
            program: args.program,
            clientToken: args.clientToken,
            inputs: args.inputs,
          })
          .pipe(map((resp) => console.log(resp))),
      );
    };

    (async () => {
      // const rests = await this.redis.xrange('online-judge', '-', '+');
      // for (const x of rests) {
      //   await deal(x);
      // }
      while (true) {
        const data = await this.redis.xread(
          'COUNT',
          '5',
          'BLOCK',
          '60000',
          'STREAMS',
          'online-judge',
          '$',
        );
        if (_.isNil(data)) {
          continue;
        }
        for (const [streamId, items] of data) {
          // console.log(streamId, items);
          for (const x of items) {
            await deal(x);
          }
        }
      }
    })();
  }

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
