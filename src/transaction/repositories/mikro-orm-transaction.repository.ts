import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from './transaction.repository';
import { EntityManager, FilterQuery, FindOptions } from '@mikro-orm/core';
import { TransactionModel } from '../models/transaction.model';
import { TransactionAdapter } from '../adapters/transaction.adapter';
import { Transaction } from '../entities/transaction.entity';
import { randomUUID } from 'crypto';
import { Wallet } from '../../wallet/entities/wallet.entity';
import { Cripto } from '../../cripto/entities/cripto.entity';

@Injectable()
export class MikroOrmTransactionRepository extends TransactionRepository {
  constructor(private readonly entityManager: EntityManager) {
    super();
  }

  async insert(
    transactionModelWithoutId: Omit<
      TransactionModel,
      'transactionId' | 'executedAt'
    >,
  ): Promise<TransactionModel> {
    const em = this.entityManager.fork();

    const criptoData = {
      ...transactionModelWithoutId.cripto,
      criptoId: randomUUID(),
    };

    const wallet = await em.findOne(Wallet, {
      walletId: transactionModelWithoutId.wallet.walletId,
    });

    if (!wallet) {
      throw new NotFoundException(
        `Wallet with id: ${transactionModelWithoutId.wallet.walletId} not found`,
      );
    }

    const critptoEntity: Cripto = em.create(Cripto, {
      ...criptoData,
      wallet,
    });

    await em.persistAndFlush(critptoEntity);

    const transactionToSave: Transaction = {
      ...transactionModelWithoutId,
      transactionId: randomUUID(),
      executedAt: new Date(),
      wallet,
      cripto: critptoEntity,
    };

    const transaction: Transaction = em.create(Transaction, transactionToSave);

    await em.persistAndFlush(transaction);

    return TransactionAdapter.fromEntityToModel(transaction);
  }

  async findAll(
    filter: FilterQuery<Transaction>,
    options?: FindOptions<Transaction>,
  ): Promise<TransactionModel[]> {
    const em = this.entityManager.fork();
    const transactions = await em.find(Transaction, filter, {
      ...options,
      populate: ['cripto', 'wallet'],
    });
    const models = transactions.map((transaction: Transaction) =>
      TransactionAdapter.fromEntityToModel(transaction),
    );
    return models;
  }

  async findOneById(id: string): Promise<TransactionModel | null> {
    const em = this.entityManager.fork();
    const transaction = await em.findOne(
      Transaction,
      { transactionId: id },
      { populate: ['cripto', 'wallet'] },
    );
    return transaction
      ? TransactionAdapter.fromEntityToModel(transaction)
      : null;
  }
}
