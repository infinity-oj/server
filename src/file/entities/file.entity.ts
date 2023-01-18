import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class File {
  @PrimaryKey()
  id: number;

  @Property({ type: 'char', length: 36 })
  uuid: string;

  @Property({ type: 'integer' })
  size: number;

  @Property({ type: 'datetime' })
  uploadTime: Date;
}
