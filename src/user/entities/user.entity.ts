import {
  Entity,
  OneToOne,
  PrimaryKey,
  PrimaryKeyProp,
  Property,
} from '@mikro-orm/core';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid' })
  userId!: string;

  [PrimaryKeyProp]?: 'userId';

  @Property()
  name!: string;

  @Property()
  surname?: string;

  @Property()
  email!: string;

  @Property()
  password!: string;

  @OneToOne(() => Wallet, (wallet) => wallet.user, {
    owner: true,
  })
  wallet!: Wallet;
}
