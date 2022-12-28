import { VM } from '@/vm/entities/vm.entity';
import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

@Entity()
export class Worker {
  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property()
  token: string;

  @OneToMany(() => VM, (vm) => vm.worker)
  vms = new Collection<VM>(this);
}
