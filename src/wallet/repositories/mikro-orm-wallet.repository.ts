import { Injectable } from '@nestjs/common';
import { WalletRepository } from './wallet.repository';
import { EntityManager, FindOptions } from '@mikro-orm/core';
import { WalletModel } from '../models/wallet.model';
import { Wallet } from '../entities/wallet.entity';
import { WalletAdapter } from '../adapters/wallet.adapter';

@Injectable()
export class MikroOrmWalletRepository extends WalletRepository {
  constructor(private readonly entityManager: EntityManager) {
    super();
  }

  async findOneById(walletId: string): Promise<WalletModel | null> {
    const em = this.entityManager.fork();
    const wallet = await em.findOne(
      Wallet,
      { walletId },
      { populate: ['criptos', 'transactions'] },
    );
    return wallet ? WalletAdapter.fromEntityToModel(wallet) : null;
  }
  async findOneByUserId(userId: string): Promise<WalletModel | null> {
    const em = this.entityManager.fork();
    const wallet = await em.findOne(
      Wallet,
      { user: { userId } },
      { populate: ['criptos', 'transactions'] },
    );
    return wallet ? WalletAdapter.fromEntityToModel(wallet) : null;
  }
  async findAll(options?: FindOptions<Wallet>): Promise<WalletModel[]> {
    const em = this.entityManager.fork();
    const wallets = await em.find(
      Wallet,
      {},
      { ...options, populate: ['criptos', 'transactions'] },
    );
    const models = wallets.map((wallet) =>
      WalletAdapter.fromEntityToModel(wallet),
    );
    return models;
  }
}
