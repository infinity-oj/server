import { Judgement } from '@/judgement/entities/judgement.entity';
import { builtins } from '@/program/builtins';
import { Program } from '@/program/entities/program.entity';
import { ProgramService } from '@/program/program.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { BadRequestException, Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import Redis from 'ioredis';
import _ from 'lodash';

import { v4 as uuid } from 'uuid';
import { SlotValue } from './slots';

@Injectable()
export class InterpreterService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly programService: ProgramService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @OnEvent('judgement.created')
  async onJudgementCreated({ judgement }: { judgement: Judgement }) {
    const { program, inputs } = judgement;
    const res = await this.run(program, inputs);
    if ('pid' in res) {
      // async task
      const pid = res['pid'];
      await this.setJudgementNameByPid(pid, judgement.name);
    } else {
      // finished task
      await this.emitProgramFinished(judgement.name, res.result);
    }
    return res;
  }
  async getJudgementNameByPid(pid: string) {
    return await this.redis.get(`pid:${pid}:judgement`);
  }
  async setJudgementNameByPid(pid: string, name: string) {
    return await this.redis.set(`pid:${pid}:judgement`, name);
  }
  async emitProgramFinished(judgementName: string, outputs: Array<SlotValue>) {
    this.eventEmitter.emit('program.finished', {
      judgement: judgementName,
      outputs,
    });
  }

  async valueFlow(
    program: Program,
    keys: Array<number>,
    values: Array<SlotValue>,
  ) {
    // put input values into redis
    if (keys.length !== values.length) {
      // TODO: find a better solution
      throw new BadRequestException();
    }
    const mp = _.zipObject(keys, values);

    // flow the values through links
    const { links } = program;
    for (const [key, value] of _.entries(mp)) {
      for (const link of links) {
        if (+key !== link.from) continue;

        keys.push(link.to);
        values.push(value);
      }
    }
  }

  async getResult(
    program: Program,
    pid: string,
    keys: number[],
  ): Promise<SlotValue[]> {
    const outputKeys = [...Array(program.outputs.slots.length).keys()].map(
      (v) => v + program.inputs.slots.length,
    );

    if (_.intersection(outputKeys, keys).length === 0) {
      return null;
    }

    const temps = await this.redis.hmget(
      pid,
      ...outputKeys.map((i) => i.toString()),
    );
    const results = _.zipWith(program.outputs.slots, temps, (slot, temp) => {
      const result = JSON.parse(temp) as SlotValue;
      return result;
    });

    if (results.some((res) => _.isNil(res))) {
      return null;
    }
    return results;
  }

  /**
   * call avaliable program
   * @param program current program
   * @param pid current process id
   * @returns subprocesses pids
   */
  async despatch(program: Program, pid: string, keys: number[]) {
    const { programs } = program;
    const queries = programs
      .filter((p) => {
        return _.intersection(p.inputs, keys).length !== 0;
      })
      .map(async (p) => {
        const requiredSlots = p.inputs
          .map((input) => (typeof input === 'number' ? input : -1))
          .filter((i) => i !== -1);
        const requiredValues = await this.redis.hmget(
          pid,
          ...requiredSlots.map((i) => i.toString()),
        );
        if (requiredValues.some((res) => _.isNil(res))) {
          return [];
        }
        const mp = _.zipObject(
          requiredSlots,
          requiredValues.map((v) => JSON.parse(v) as SlotValue),
        );

        const newProgram = await this.programService.findOneByName(p.name);

        const inputs = p.inputs.map((input) => {
          if (typeof input === 'number') {
            return mp[input];
          } else {
            return input;
          }
        });

        const res = await this.run(newProgram, inputs, pid);
        if ('pid' in res) {
          // asynchronized process
          await this.redis.hset(pid, {
            [res.pid]: JSON.stringify(p.outputs),
          });
          return [];
        } else {
          const keys = p.outputs;
          const values = res.result;
          this.valueFlow(program, keys, values);
          const mp = _.zipObject(
            keys,
            values.map((value) => JSON.stringify(value)),
          );
          await this.redis.hset(pid, mp);
          return keys;
        }
      });
    const results = (await Promise.all(queries)).filter(
      (res) => !_.isEmpty(res),
    );
    return _.uniq(_.flattenDeep(results));
  }

  async run(
    program: Program,
    inputs: Array<SlotValue>,
    parent = undefined,
  ): Promise<
    | {
        pid: string;
      }
    | { result: Array<SlotValue> }
  > {
    const consts = program.inputs.slots
      .filter((slot) => !_.isNil(slot.const))
      .map(
        (slot) =>
          ({
            type: slot.type,
            value: slot.const,
          } as SlotValue),
      );
    inputs = _.concat(inputs, consts);

    for (const builtin of builtins) {
      if (
        builtin.program.name === program.name &&
        'implementation' in builtin
      ) {
        return {
          result: builtin.implementation(...inputs),
        };
      }
    }

    const pid = `p-${uuid()}`;
    await this.redis.del(pid);

    const keys = [...Array(program.inputs.slots.length).keys()];
    const values = inputs;
    this.valueFlow(program, keys, values);

    const mp = _.zipObject(
      keys,
      values.map((value) => JSON.stringify(value)),
    );

    const obj = Object.assign({}, mp, {
      program: JSON.stringify(program),
      parent,
    });
    await this.redis.hset(pid, obj);

    let k = keys;
    while (!_.isEmpty(k)) {
      const result = await this.getResult(program, pid, k);
      if (!_.isEmpty(result)) {
        // has result once run
        console.log(pid, result);
        await this.redis.del(pid);
        return { result };
      }
      k = await this.despatch(program, pid, k);
    }
    await this.redis.rpush(`processes:type:${program.name}`, pid);
    return { pid };
  }

  async finish(
    pid: string,
    outputs: Array<SlotValue>,
  ): Promise<{ pid: string; result: Array<SlotValue> }> {
    const parent = (await this.redis.hmget(pid, 'parent'))[0];
    await this.redis.del(pid);
    if (!parent) {
      const judgementName = await this.getJudgementNameByPid(pid);
      await this.emitProgramFinished(judgementName, outputs);

      return {
        pid,
        result: outputs,
      };
    }

    const ctx = await this.redis.hgetall(parent);
    const program = JSON.parse(ctx.program) as Program;
    const outputSlots = JSON.parse(ctx[pid]) as Array<number>;
    await this.redis.hdel(parent, pid);

    pid = parent;

    const keys = outputSlots;
    const values = outputs;
    this.valueFlow(program, keys, values);

    const mp = _.zipObject(
      keys,
      values.map((value) => JSON.stringify(value)),
    );
    await this.redis.hset(pid, mp);

    let k = keys;
    while (!_.isEmpty(k)) {
      const result = await this.getResult(program, pid, k);
      if (result) {
        console.log(pid, result);
        return await this.finish(pid, result);
      }
      k = await this.despatch(program, pid, k);
    }
  }
}
