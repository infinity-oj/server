import { Entity, ManyToOne, PrimaryKey } from '@mikro-orm/core';
import { Worker } from '@/worker/entities/worker.entity';

@Entity()
export class VM {
  @PrimaryKey()
  id: number;

  @ManyToOne()
  worker!: Worker;
}
