import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Client {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  name: string;

  @Property()
  token: string;

  @Property()
  callbackUrl: string;
}
