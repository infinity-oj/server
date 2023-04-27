import {
  Entity,
  Enum,
  ManyToOne,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { VM } from '@/vm/entities/vm.entity';
import { Client } from '@/client/entities/client.entity';
import { SlotValue } from '@/interpreter/slots';
import { Program } from '@/program/entities/program.entity';

export enum JudgementStatus {
  Pending,
  Canceled,
  Finished,

  SystemError,
  ConfigurationError,
  CompilationError,
  FileError,
  RuntimeError,

  TimeLimitExceeded,
  MemoryLimitExceeded,
  OutputLimitExceeded,

  PartiallyCorrect,
  WrongAnswer,
  Accepted,
}

export enum CTFJudgementStatus {
  Pending,

  Accepted,
}

@Entity()
export class Judgement {
  @PrimaryKey()
  id: number;

  @Property()
  name!: string;

  @ManyToOne()
  client: Client;

  @Enum(() => JudgementStatus)
  status!: JudgementStatus;

  @ManyToOne()
  program: Program;

  @Property({ type: 'json', nullable: true })
  inputs: Array<SlotValue>;

  @Property({ type: 'json', nullable: true })
  outputs: Array<SlotValue>;

  @Property({ nullable: true })
  token: string;

  @Property({ nullable: true })
  fileToken: string;
}
