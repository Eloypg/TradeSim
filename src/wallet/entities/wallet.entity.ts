import {
  Collection,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { User } from '../../user/entities/user.entity';
import { Cripto } from '../../cripto/entities/cripto.entity';
import { Transaction } from '../../transaction/entities/transaction.entity';

@Entity()
export class Wallet {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  walletId!: string;

  @Property({ type: 'decimal', precision: 15, scale: 2 })
  balance: number = 0;

  @Property()
  createdAt: Date = new Date();

  @Property({ nullable: true })
  updatedAt?: Date;

  @OneToOne(() => User, (user) => user.wallet)
  user!: User;

  @OneToMany(() => Cripto, (cripto) => cripto.wallet, { nullable: true })
  criptos? = new Collection<Cripto>(this);

  @OneToMany(() => Transaction, (transaction) => transaction.wallet, {
    nullable: true,
  })
  transactions? = new Collection<Transaction>(this);
}
