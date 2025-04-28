import { Entity, OneToOne, PrimaryKey } from '@mikro-orm/core';
import { User } from 'src/user/entities/user.entity';

@Entity()
export class Wallet {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  walletId!: string;

  @OneToOne(() => User, (user) => user.wallet)
  user!: Pick<User, 'userId'>;
}
