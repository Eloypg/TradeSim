import { PrimaryKey, Property } from '@mikro-orm/core';

export class User {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  userId!: string;

  @Property()
  name!: string;

  @Property()
  surname1?: string;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @Property()
  wallet!: string; //FIXME add relation with wallet
}
