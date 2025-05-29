import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { TransactionType } from '../../common/enums/transaction-type.enum';
import { Cripto } from '../../cripto/entities/cripto.entity';
import { Wallet } from '../../wallet/entities/wallet.entity';

@Entity()
export class Transaction {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  transactionId!: string;

  @Property({ type: 'string' })
  type!: TransactionType;

  @Property({ type: 'decimal', precision: 20, scale: 8 })
  amount!: number;

  @Property({ type: 'decimal', precision: 20, scale: 8 })
  criptoPricePerUnit: number;

  @Property({ type: 'decimal', precision: 20, scale: 8 })
  totalPriceTransaction: number;

  @Property()
  executedAt: Date = new Date();

  @ManyToOne(() => Wallet)
  wallet!: Wallet;

  @ManyToOne(() => Cripto)
  cripto!: Cripto;
}
