import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { builtins } from '@/program/builtins';
import { Program } from '@/program/entities/program.entity';

export class ProgramsSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    for (const builtin of builtins) {
      em.create(Program, builtin.program);
    }
  }
}
