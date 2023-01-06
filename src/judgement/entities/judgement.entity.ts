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

export enum JudgementStatus {
  Pending,
  Canceled,

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

  @Property({ nullable: true })
  publicVolume: string;

  @Property({ nullable: true })
  privateVolume: string;

  @Property({ nullable: true })
  userVolume: string;

  @Property({ nullable: true })
  token: string;

  @Property({ nullable: true })
  fileToken: string;
}
