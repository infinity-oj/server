import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { v4 as uuid } from 'uuid';
import { Program } from '@/program/entities/program.entity';
import _ from 'lodash';
import {
  InterpreterService,
  SlotValue,
} from '@/interpreter/interpreter.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly interpreterService: InterpreterService,
  ) {}

  async stat() {
    return {};
  }

  // 1. map process id to task id

  async findAll() {}

  async fetchOneByType(taskType: string) {
    // lock this task
    const pid = await this.redis.lpop(`processes:type:${taskType}`);

    if (_.isEmpty(pid)) {
      return null;
    }

    console.log(`processes:type:${taskType}`, pid);

    const taskId = uuid();
    if ((await this.redis.set(`process:${pid}:task`, taskId, 'NX')) === null)
      return null;

    const ctx = await this.redis.hgetall(pid);
    const program = JSON.parse(ctx.program) as Program;
    const inputKeys = [...Array(program.outputs.slots.length).keys()];

    const results = await this.redis.hmget(
      pid,
      ...inputKeys.map((i) => i.toString()),
    );
    const inputSlots = results.map((res) => JSON.parse(res) as SlotValue);

    await this.redis.set(`task:${taskId}:process`, pid);
    return {
      id: taskId,
      type: program.name,
      inputs: inputSlots,
    };
  }

  async findOne(id: string) {
    return `This action returns a #${id} task`;
  }

  async submit(taskId: string, outputs: Array<SlotValue>) {
    const pid = await this.redis.get(`task:${taskId}:process`);
    if (pid.length === 0) {
      throw new BadRequestException();
    }
    await this.redis.del(`task:${taskId}:process`, `process:${pid}:task`);

    // TODO: outputs validation

    const res = await this.interpreterService.finish(pid, outputs);
    console.log(res);
  }
}
