import { Entity, Enum, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { VM } from '@/vm/entities/vm.entity';

export enum TraditionJudgementStatus {
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

@Entity({
  discriminatorColumn: 'type',
  discriminatorMap: { judgement: 'Judgement', ctfJudgement: 'CTFJudgement' },
})
export class Judgement {
  @PrimaryKey()
  id: number;

  @Property()
  name!: string;
}

@Entity()
export class CTFJudgement extends Judgement {
  @Enum(() => CTFJudgementStatus)
  status!: CTFJudgementStatus;

  @OneToOne()
  vm!: VM;
}

@Entity()
export class TraditionJudgement extends Judgement {
  @Enum(() => TraditionJudgementStatus)
  status!: TraditionJudgementStatus;

  @OneToOne()
  vm!: VM;
}
