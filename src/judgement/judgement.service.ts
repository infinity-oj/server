import { Client } from '@/client/entities/client.entity';
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { UpdateJudgementDto } from './dto/update-judgement.dto';
import { Judgement, JudgementStatus } from './entities/judgement.entity';
import { v4 as uuid } from 'uuid';
import { Program } from '@/program/entities/program.entity';
import { SlotValue } from '@/interpreter/interpreter.service';
import { HttpService } from '@nestjs/axios';
import { OnEvent } from '@nestjs/event-emitter';
import _ from 'lodash';

@Injectable()
export class JudgementService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
    @InjectRepository(Judgement)
    private readonly judgementRepository: EntityRepository<Judgement>,

    private readonly httpService: HttpService,
  ) {}

  async create(client: Client, program: Program, inputs: Array<SlotValue>) {
    const judgement = new Judgement();
    judgement.client = client;
    judgement.program = program;
    judgement.name = uuid();
    judgement.status = JudgementStatus.Pending;
    judgement.inputs = inputs;

    await this.judgementRepository.persistAndFlush(judgement);
    return judgement;
  }

  @OnEvent('program.finished')
  async report(event: { judgement: string; outputs: Array<SlotValue> }) {
    const { outputs } = event;
    const judgement = await this.judgementRepository.findOne(
      {
        name: event.judgement,
      },
      {
        populate: ['client'],
      },
    );
    if (_.isNull(judgement)) {
      return;
    }

    judgement.outputs = outputs;
    judgement.status = JudgementStatus.Finished;
    await this.judgementRepository.persistAndFlush(judgement);

    const { client } = judgement;
    this.httpService
      .post(client.callbackUrl, {
        name: judgement.name,
        outputs: outputs,
      })
      .subscribe({
        next: (result) => {},
        error: (err: any) => {
          console.error(err);
        },
        complete() {},
      });
  }

  async createJudgement(client: Client) {
    const judgement = new Judgement();
    judgement.name = uuid();
    judgement.client = client;
    judgement.status = JudgementStatus.Pending;
    await this.em.fork().persistAndFlush(judgement);
    return judgement;
  }

  findAll() {
    return `This action returns all judgement`;
  }

  async findOne(id: number) {
    return await this.em.findOneOrFail(Judgement, { id });
  }

  update(id: number, updateJudgementDto: UpdateJudgementDto) {
    return `This action updates a #${id} judgement`;
  }

  remove(id: number) {
    return `This action removes a #${id} judgement`;
  }
}
