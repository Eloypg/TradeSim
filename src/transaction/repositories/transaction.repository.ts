import { FilterQuery, FindOptions, Transaction } from '@mikro-orm/core';
import { TransactionModel } from '../models/transaction.model';

export abstract class TransactionRepository {
  abstract insert(
    transactionModelWithoutId: Omit<
      TransactionModel,
      'transactionId' | 'executedAt'
    >,
  ): Promise<TransactionModel>;

  abstract findAll(
    filter: FilterQuery<Transaction>,
    options?: FindOptions<Transaction>,
  ): Promise<TransactionModel[]>;

  abstract findOneById(id: string): Promise<TransactionModel | null>;
}
