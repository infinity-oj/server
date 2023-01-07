import { builtins } from '@/program/builtins';
import { Program } from '@/program/entities/program.entity';
import { ProgramService } from '@/program/program.service';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { BadRequestException, Injectable } from '@nestjs/common';
import Redis from 'ioredis';
import _ from 'lodash';

// import { v4 as uuid } from 'uuid';

const uuid = (() => {
  let cnt = 0;
  return () => cnt++;
})();

@Injectable()
export class InterpreterService {
  constructor(
    @InjectRedis() private readonly redis: Redis,
    private readonly programService: ProgramService,
  ) {}

  async valueFlow(
    program: Program,
    keys: Array<number>,
    values: Array<number | string>,
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

        // key = link.from
        keys.push(link.to);
        values.push(value);
      }
    }
  }

  async getResult(program: Program, pid: string, keys: number[]) {
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

    const results = _.zipWith(program.outputs.slots, temps, (slot, result) => {
      if (slot.type === 'number') {
        return +result;
      }
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
        const inputs = await this.redis.hmget(
          pid,
          ...p.inputs.map((i) => i.toString()),
        );
        if (inputs.some((res) => _.isEmpty(res))) {
          return [];
        }

        const newProgram = await this.programService.findOneByName(p.name);
        const res = await this.run(newProgram, inputs, pid);
        if ('pid' in res) {
          // asynchronized process
          await this.redis.hmset(pid, {
            [res.pid]: JSON.stringify(p.outputs),
          });
          return [];
        } else {
          const keys = p.outputs;
          const values = res.result;
          this.valueFlow(program, keys, values);
          const mp = _.zipObject(keys, values);
          await this.redis.hmset(pid, mp);
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
    inputs: Array<string | number>,
    parent = '',
  ): Promise<
    | {
        pid: string;
      }
    | { result: Array<string | number> }
  > {
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

    const mp = _.zipObject(keys, values);
    mp.program = JSON.stringify(program);
    if (parent.length !== 0) {
      mp.parent = parent;
    }
    await this.redis.hmset(pid, mp);

    console.log(keys, values);

    let k = keys;
    while (!_.isEmpty(k)) {
      const result = await this.getResult(program, pid, k);
      if (!_.isEmpty(result)) {
        // has result once run
        console.log(pid, result);
        return { result };
      }
      k = await this.despatch(program, pid, k);
    }
    return { pid };
  }

  async finish(pid: string, outputs: Array<string | number>) {
    console.log('finished', pid);
    const parent = (await this.redis.hmget(pid, 'parent'))[0];
    await this.redis.del(pid);
    if (!parent) {
      return {
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

    const mp = _.zipObject(keys, values);
    await this.redis.hmset(pid, mp);

    let k = keys;
    while (!_.isEmpty(k)) {
      const result = await this.getResult(program, pid, k);
      if (result) {
        await this.finish(pid, result);
        console.log(pid, result);
        return { result };
      }
      k = await this.despatch(program, pid, k);
    }
  }
}
