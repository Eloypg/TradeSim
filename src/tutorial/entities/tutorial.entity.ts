import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Tutorial {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  tutorialId!: string;

  @Property()
  title!: string;

  @Property()
  description!: string;

  @Property()
  url!: string;

  @Property()
  postedAt: Date = new Date();
}
