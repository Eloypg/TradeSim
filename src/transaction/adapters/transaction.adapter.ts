import { CriptoAdapter } from '../../cripto/adapters/cripto.adapter';
import { Transaction } from '../entities/transaction.entity';
import { TransactionModel } from '../models/transaction.model';
import { TransactionResponseDto } from '../dto/transaction-response.dto';

export class TransactionAdapter {
  static fromEntityToModel(entity: Transaction): TransactionModel {
    const model = new TransactionModel();
    model.transactionId = entity.transactionId;
    model.type = entity.type;
    model.amount = entity.amount;
    model.criptoPricePerUnit = entity.criptoPricePerUnit;
    model.totalPriceTransaction = entity.totalPriceTransaction;
    model.executedAt = entity.executedAt;
    model.wallet = { walletId: entity.wallet.walletId };
    model.cripto = CriptoAdapter.fromEntityToModel(entity.cripto);
    return model;
  }

  static fromModelToResponseDto(
    model: TransactionModel,
  ): TransactionResponseDto {
    return {
      type: model.type,
      amount: model.amount,
      criptoPricePerUnit: model.criptoPricePerUnit,
      totalPriceTransaction: model.totalPriceTransaction,
      executedAt: model.executedAt,
      wallet: {
        walletId: model.wallet.walletId,
      },
      cripto: CriptoAdapter.fromModelToReferenceResponseDto(model.cripto),
    };
  }
}
