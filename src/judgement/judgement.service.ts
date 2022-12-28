import { EntityManager, EntityRepository, MikroORM } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateJudgementDto } from './dto/create-judgement.dto';
import { UpdateJudgementDto } from './dto/update-judgement.dto';
import { CTFJudgement, Judgement } from './entities/judgement.entity';

@Injectable()
export class JudgementService {
  constructor(
    private readonly orm: MikroORM,
    private readonly em: EntityManager,
  ) {}
  create(createJudgementDto: CreateJudgementDto) {
    return 'This action adds a new judgement';
  }

  async findoneCTFJudgementByName(name: string) {
    return await this.em.findOneOrFail(
      CTFJudgement,
      { name },
      { populate: ['vm'] },
    );
  }

  findAll() {
    return `This action returns all judgement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} judgement`;
  }

  update(id: number, updateJudgementDto: UpdateJudgementDto) {
    return `This action updates a #${id} judgement`;
  }

  remove(id: number) {
    return `This action removes a #${id} judgement`;
  }
}
