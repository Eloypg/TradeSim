import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity()
export class Cripto {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  criptoId!: string;

  @Property()
  symbol!: string;

  @Property()
  name!: string;

  @Property()
  precision: number = 8;

  @Property({ type: 'decimal', precision: 20, scale: 8 })
  currentPrice!: number;

  @ManyToOne(() => Wallet)
  wallet?: Wallet;
}
