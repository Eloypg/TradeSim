import { Entity, OneToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Wallet } from 'src/wallet/entities/wallet.entity';

@Entity()
export class User {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  userId!: string;

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
  wallet!: Pick<Wallet, 'walletId'>;
}
