import { FindOptions } from '@mikro-orm/core';
import { WalletModel } from '../models/wallet.model';
import { Wallet } from '../entities/wallet.entity';

export abstract class WalletRepository {
  abstract findOneById(walletId: string): Promise<WalletModel | null>;
  abstract findOneByUserId(userId: string): Promise<WalletModel | null>;
  abstract findAll(options?: FindOptions<Wallet>): Promise<WalletModel[]>;
}
