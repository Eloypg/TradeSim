import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { TransactionModel } from '../models/transaction.model';
import { FilterQuery, FindOptions } from '@mikro-orm/core';

@Injectable()
export class TransactionService {
  constructor(private readonly repository: TransactionRepository) {}

  async create(
    data: Omit<TransactionModel, 'transactionId' | 'executedAt'>,
  ): Promise<TransactionModel> {
    return this.repository.insert(data);
  }

  async getAll(
    filter: FilterQuery<TransactionModel>,
    options?: FindOptions<TransactionModel>,
  ): Promise<TransactionModel[]> {
    return this.repository.findAll(filter, options);
  }

  async getOneById(id: string): Promise<TransactionModel> {
    const transaction: TransactionModel | null =
      await this.repository.findOneById(id);
    if (!transaction) {
      throw new NotFoundException(`Transaction with id: ${id} not found`);
    }
    return transaction;
  }
}
