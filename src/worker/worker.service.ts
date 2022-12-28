import { EntityRepository, UseRequestContext } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { CreateWorkerDto } from './dto/create-worker.dto';
import { UpdateWorkerDto } from './dto/update-worker.dto';
import { Worker } from './entities/worker.entity';
import { WorkerRepository } from './worker.repository';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(Worker)
    private readonly workerRepository: WorkerRepository,
  ) {}

  create(createWorkerDto: CreateWorkerDto) {
    return 'This action adds a new worker';
  }

  findAll() {
    return `This action returns all worker`;
  }

  findOne(id: number) {
    return `This action returns a #${id} worker`;
  }

  async findByName(name: string) {
    return await this.workerRepository.findOneOrFail({ name });
  }

  update(id: number, updateWorkerDto: UpdateWorkerDto) {
    return `This action updates a #${id} worker`;
  }

  remove(id: number) {
    return `This action removes a #${id} worker`;
  }
}
