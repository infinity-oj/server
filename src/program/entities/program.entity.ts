import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

export class SlotDef {
  name: string;
  type: string;
}

export class LinkDef {
  from: number;
  to: number;
}

export class ProgramRef {
  name: string;
  // input slot id
  inputs: Array<number>;
  // output slot id
  outputs: Array<number>;
}

@Entity()
export class Program {
  @PrimaryKey()
  id: number;

  @Property({ unique: true })
  name: string;

  @Property({ type: 'json' })
  inputs: {
    slots: Array<SlotDef>;
  };

  @Property({ type: 'json' })
  outputs: {
    slots: Array<SlotDef>;
  };

  @Property({ type: 'json' })
  programs: Array<ProgramRef>;

  @Property({ type: 'json' })
  links: Array<LinkDef>;
}
