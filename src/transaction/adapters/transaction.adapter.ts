import { Transaction } from '../entities/transaction.entity';
import { TransactionModel } from '../models/transaction.model';

export class TransactionAdapter {
  static fromEntityToModel(entity: Transaction): TransactionModel {
    const model = new TransactionModel();
    model.transactionId = entity.transactionId;
    model.type = entity.type;
    model.amount = entity.amount;
    model.criptoPricePerUnit = entity.criptoPricePerUnit;
    model.totalPriceTransaction = entity.totalPriceTransaction;
    model.executedAt = entity.executedAt;
    model.wallet = entity.wallet;
    model.cripto = entity.cripto;
    return model;
  }
}
