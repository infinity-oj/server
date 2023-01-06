import { Client } from '@/client/entities/client.entity';
import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateJudgementDto } from './dto/create-judgement.dto';
import { UpdateJudgementDto } from './dto/update-judgement.dto';
import { Judgement, JudgementStatus } from './entities/judgement.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class JudgementService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}
  create(createJudgementDto: CreateJudgementDto) {
    return 'This action adds a new judgement';
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
